// #region Imports

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis, type Redis as IRedis } from 'ioredis';
import { ICacheMetricsRecorder } from '../ICacheMetricsRecorder.js';
import { ICacheStats } from '../ICacheStats.js';
import { ILayeredCache } from '../interfaces/ILayeredCache.js';
import { NoopCacheMetricsRecorder } from '../metrics/noop/NoopCacheMetricsRecorder.js';

// #endregion

/**
 * Configuration options for {@link RedisLayeredCache}.
 *
 * @public
 * @template TValue  The type of values stored in this cache.
 */
export interface IRedisLayeredCacheOptions<TValue> {
    /**
     * Redis connection URL (e.g. `redis://localhost:6379`).
     *
     * @public
     */
    url: string;

    /**
     * Key prefix applied to all Redis keys managed by this cache instance.
     *
     * @public
     */
    keyPrefix: string;

    /**
     * Optional TTL in seconds applied to every stored entry.
     *
     * @public
     */
    ttlSeconds?: number;

    /**
     * Custom serialization function. Defaults to `JSON.stringify`.
     *
     * @public
     */
    serialize?: (value: TValue) => string;

    /**
     * Custom deserialization function. Defaults to `JSON.parse`.
     *
     * @public
     */
    deserialize?: (raw: string) => TValue;

    /**
     * Optional metrics recorder forwarded cache operation statistics.
     *
     * @public
     */
    metricsRecorder?: ICacheMetricsRecorder;

    /**
     * An optional name / label for the cache instance, used in metrics.
     * Defaults to `'redis'`.
     *
     * @public
     */
    cacheName?: string;
}

/**
 * Redis-backed layered cache implementation. Falls back to an asynchronous
 * loader function when the requested key is not present in Redis.
 *
 * @remarks
 * Synchronous methods (`get`, `set`, `invalidate`) throw because Redis
 * is inherently asynchronous. Use the `*Async` variants instead.
 *
 * @public
 * @template TKey  The type of the cache keys.
 * @template TValue  The type of the cache values.
 */
@Injectable()
export class RedisLayeredCache<TKey, TValue> implements ILayeredCache<TKey, TValue>, OnModuleDestroy {
    // #region Fields

    private readonly _loadFn: (key: TKey) => Promise<TValue | undefined>;
    private readonly _logger: Logger = new Logger(RedisLayeredCache.name);
    private readonly _redis: IRedis;
    private readonly _options: IRedisLayeredCacheOptions<TValue>;
    private readonly _inflight: Map<string, Promise<TValue | undefined>> = new Map();
    private _hits = 0;
    private _misses = 0;
    private _loads = 0;
    private _loadErrors = 0;
    private readonly _metrics: ICacheMetricsRecorder;
    private readonly _cacheName: string;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link RedisLayeredCache} class.
     *
     * @param loadFn - Async loader invoked on cache misses.
     * @param options - Redis connection and cache behaviour configuration.
     */
    public constructor(loadFn: (key: TKey) => Promise<TValue | undefined>, options: IRedisLayeredCacheOptions<TValue>) {
        this._loadFn = loadFn;
        this._options = options;
        this._redis = new Redis(options.url, { keyPrefix: options.keyPrefix });
        this._metrics = options.metricsRecorder ?? new NoopCacheMetricsRecorder();
        this._cacheName = options.cacheName ?? 'redis';
    }

    // #endregion

    // #region Methods

    /**
     * Not supported - Redis is inherently asynchronous.
     *
     * @throws Always throws. Use {@link getAsync} instead.
     */
    public get(key: TKey): TValue | undefined {
        throw new Error(`RedisLayeredCache.get() cannot be synchronous. Use getAsync() instead for key: ${String(key)}`);
    }

    /** @inheritdoc */
    public async getAsync(key: TKey): Promise<TValue | undefined> {
        const redisKey = this._formatKey(key);
        let deserialized: TValue | undefined | symbol = undefined;
        try {
            const raw = await this._redis.get(redisKey);
            if (raw) deserialized = this._deserialize(raw) ?? Symbol('bad-json');
        } catch (e: unknown) {
            this._logger.warn(`redis get fail key=${redisKey} err=${(e as Error).message}`);
        }
        if (deserialized !== undefined && typeof deserialized !== 'symbol') {
            this._hits++;
            this._metrics.recordHit(this._cacheName);
            return deserialized as TValue;
        }
        // malformed json or cache miss
        this._misses++;
        this._metrics.recordMiss(this._cacheName);

        // Single-flight: deduplicate concurrent loads for the same key
        const inflightKey = this._formatKey(key);
        const existing = this._inflight.get(inflightKey);

        if (existing) {
            return existing;
        }

        const loadPromise = this._safeLoad(key)
            .then((loaded) => {
                this._inflight.delete(inflightKey);

                if (loaded !== undefined) {
                    void this.setAsync(key, loaded);
                    this._loads++;
                    this._metrics.recordLoadSuccess(this._cacheName);
                }

                return loaded;
            })
            .catch((error: unknown) => {
                this._inflight.delete(inflightKey);
                throw error;
            });

        this._inflight.set(inflightKey, loadPromise);

        return loadPromise;
    }

    /**
     * Not supported - Redis is inherently asynchronous.
     *
     * @throws Always throws. Use {@link setAsync} instead.
     */
    public set(key: TKey, value: TValue): void {
        throw new Error(`RedisLayeredCache.set() cannot be synchronous. Use setAsync() instead for key: ${String(key)}`);
    }

    /** @inheritdoc */
    public async setAsync(key: TKey, value: TValue): Promise<void> {
        const redisKey = this._formatKey(key);
        try {
            const serialized = this._serialize(value);
            if (this._options.ttlSeconds) await this._redis.set(redisKey, serialized, 'EX', this._options.ttlSeconds);
            else await this._redis.set(redisKey, serialized);
        } catch (e: unknown) {
            this._logger.warn(`redis set fail key=${redisKey} err=${(e as Error).message}`);
        }
    }

    /** @inheritdoc */
    public async warm(key: TKey): Promise<TValue | undefined> {
        return this.getAsync(key);
    }

    /**
     * Not supported - Redis is inherently asynchronous.
     *
     * @throws Always throws. Use {@link invalidateAsync} instead.
     */
    public invalidate(key: TKey): void {
        throw new Error(`RedisLayeredCache.invalidate() cannot be synchronous. Use invalidateAsync() instead for key: ${String(key)}`);
    }

    /** @inheritdoc */
    public async invalidateAsync(key: TKey): Promise<void> {
        try {
            await this._redis.del(this._formatKey(key));
        } catch (e: unknown) {
            this._logger.warn(`redis del fail key=${String(key)} err=${(e as Error).message}`);
        }
    }

    /** @inheritdoc */
    public stats(): ICacheStats {
        return {
            hits: this._hits,
            misses: this._misses,
            loads: this._loads,
            loadErrors: this._loadErrors,
        };
    }

    /**
     * Gracefully disconnects the Redis client when the NestJS module is destroyed.
     */
    public async onModuleDestroy(): Promise<void> {
        try {
            await this._redis.quit();
        } catch (e: unknown) {
            this._logger.error(`redis disconnect failed err=${(e as Error).message}`);
        }
    }

    private async _safeLoad(key: TKey): Promise<TValue | undefined> {
        try {
            return await this._loadFn(key);
        } catch (e: unknown) {
            this._logger.error(`redis load failed key=${String(key)} err=${(e as Error).message}`);
            this._loadErrors++;
            this._metrics.recordLoadError(this._cacheName);
            return undefined;
        }
    }

    private _formatKey(key: TKey): string {
        if (key === null || key === undefined) return String(key);
        if (typeof key === 'string' || typeof key === 'number' || typeof key === 'boolean') return String(key);
        return JSON.stringify(key);
    }

    private _serialize(value: TValue): string {
        if (this._options.serialize) return this._options.serialize(value);
        return JSON.stringify(value);
    }

    private _deserialize(raw: string): TValue | undefined {
        try {
            if (this._options.deserialize) return this._options.deserialize(raw);
            return JSON.parse(raw) as TValue;
        } catch (e: unknown) {
            this._logger.error(`deserialization failed err=${(e as Error).message}`);
            return undefined;
        }
    }

    // #endregion
}
