// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { ICacheMetricsRecorder } from '../ICacheMetricsRecorder.js';
import { ICacheStats } from '../ICacheStats.js';
import { ILayeredCache } from '../interfaces/ILayeredCache.js';
import { NoopCacheMetricsRecorder } from '../metrics/noop/NoopCacheMetricsRecorder.js';

// #endregion

/**
 * Configuration options for {@link MemoryLayeredCache}.
 *
 * @public
 */
export interface ILayeredCacheOptions {
    // #region Properties

    /**
     * Time to live in milliseconds. Entries older than this are considered expired.
     * Defaults to infinite (no expiration).
     *
     * @public
     */
    ttlMs?: number;

    /**
     * When `true`, expired entries are served immediately while a background
     * refresh is triggered. Defaults to `false`.
     *
     * @public
     */
    staleWhileRevalidate?: boolean;

    /**
     * Maximum number of entries retained in the cache. Oldest entries are
     * evicted first (LRU). Defaults to infinite.
     *
     * @public
     */
    maxEntries?: number;

    /**
     * Optional metrics recorder forwarded cache operation statistics.
     * Falls back to {@link NoopCacheMetricsRecorder} when omitted.
     *
     * @public
     */
    metricsRecorder?: ICacheMetricsRecorder;

    /**
     * An optional name / label for the cache instance, used in metrics.
     * Defaults to `'memory'`.
     *
     * @public
     */
    cacheName?: string;

    // #endregion
}

/**
 * In-memory layered cache with LRU eviction, TTL expiration and
 * optional stale-while-revalidate support. Falls back to an
 * asynchronous loader function on cache misses.
 *
 * @public
 * @template TKey  The type of the cache keys.
 * @template TValue  The type of the cache values.
 */
@Injectable()
export class MemoryLayeredCache<TKey, TValue> implements ILayeredCache<TKey, TValue> {
    // #region Fields

    private readonly _store: Map<TKey, IEntry<TValue>> = new Map();
    private readonly _logger: Logger = new Logger(MemoryLayeredCache.name);
    private readonly _loadFn: (key: TKey) => Promise<TValue | undefined>;
    private readonly _options: ILayeredCacheOptions;
    private readonly _metrics: ICacheMetricsRecorder;
    private readonly _cacheName: string;
    private _hits = 0;
    private _misses = 0;
    private _loads = 0;
    private _loadErrors = 0;
    private _evictions = 0;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link MemoryLayeredCache} class.
     *
     * @param loadFn - Async loader invoked on cache misses.
     * @param options - Optional configuration for TTL, LRU and metrics.
     */
    public constructor(loadFn: (key: TKey) => Promise<TValue | undefined>, options?: ILayeredCacheOptions) {
        this._loadFn = loadFn;
        this._options = options ?? {};
        this._metrics = this._options.metricsRecorder ?? new NoopCacheMetricsRecorder();
        this._cacheName = this._options.cacheName ?? 'memory';
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public get(key: TKey): TValue | undefined {
        const entry = this._store.get(key);
        if (entry && entry.loaded) {
            if (!this._isExpired(entry)) {
                this._hits++;
                this._metrics.recordHit(this._cacheName);
                this._touch(key, entry);
                return entry.value;
            }
            if (this._options.staleWhileRevalidate && entry.value !== undefined) {
                this._hits++;
                this._metrics.recordHit(this._cacheName);
                return entry.value;
            }
        }
        this._misses++;
        this._metrics.recordMiss(this._cacheName);
        return undefined;
    }

    /** @inheritdoc */
    public async getAsync(key: TKey): Promise<TValue | undefined> {
        const entry = this._store.get(key);
        if (entry && entry.loaded) {
            if (!this._isExpired(entry)) {
                this._hits++;
                this._metrics.recordHit(this._cacheName);
                this._touch(key, entry);
                return entry.value;
            }
            if (this._options.staleWhileRevalidate && entry.value !== undefined) {
                if (!entry.loading) entry.loading = this._refresh(key, entry);
                this._hits++; // still serve stale
                this._metrics.recordHit(this._cacheName);
                return entry.value;
            }
        }
        this._misses++;
        this._metrics.recordMiss(this._cacheName);
        return this._loadFresh(key);
    }

    /** @inheritdoc */
    public set(key: TKey, value: TValue): void {
        this._insert(key, {
            value,
            at: Date.now(),
            loaded: true,
        });
    }

    /** @inheritdoc */
    public async setAsync(key: TKey, value: TValue): Promise<void> {
        this._insert(key, {
            value,
            at: Date.now(),
            loaded: true,
        });
    }

    /** @inheritdoc */
    public async warm(key: TKey): Promise<TValue | undefined> {
        if (this._store.has(key)) return this._store.get(key)?.value;
        return this.getAsync(key);
    }

    /** @inheritdoc */
    public invalidate(key: TKey): void {
        this._store.delete(key);
    }

    /** @inheritdoc */
    public async invalidateAsync(key: TKey): Promise<void> {
        this._store.delete(key);
    }

    /** @inheritdoc */
    public stats(): ICacheStats {
        return {
            hits: this._hits,
            misses: this._misses,
            loads: this._loads,
            loadErrors: this._loadErrors,
            evictions: this._evictions,
        };
    }

    private _isExpired(entry: IEntry<TValue>): boolean {
        if (!this._options.ttlMs) return false;
        return Date.now() - entry.at >= this._options.ttlMs;
    }

    private async _loadFresh(key: TKey): Promise<TValue | undefined> {
        const existing = this._store.get(key);
        if (existing?.loading) return existing.loading;
        const loading = this._loadFn(key)
            .then((val) => {
                this._insert(key, {
                    value: val as TValue,
                    at: Date.now(),
                    loaded: true,
                });
                this._loads++;
                this._metrics.recordLoadSuccess(this._cacheName);
                return val;
            })
            .catch((e: unknown) => {
                this._logger.error(`load failed key=${String(key)} err=${(e as Error).message}`);
                this._loadErrors++;
                this._metrics.recordLoadError(this._cacheName);
                if (existing) existing.loading = undefined;
                return existing?.value;
            });
        if (existing) existing.loading = loading;
        else
            this._store.set(key, {
                value: undefined as unknown as TValue,
                at: 0,
                loading,
            });
        return loading;
    }

    private async _refresh(key: TKey, entry: IEntry<TValue>): Promise<TValue | undefined> {
        try {
            const fresh = await this._loadFn(key);
            if (fresh !== undefined) {
                this._insert(key, {
                    value: fresh,
                    at: Date.now(),
                    loaded: true,
                });
                this._loads++;
                this._metrics.recordLoadSuccess(this._cacheName);
                return fresh;
            }
            return entry.value;
        } catch (e: unknown) {
            this._logger.error(`refresh failed key=${String(key)} err=${(e as Error).message}`);
            this._loadErrors++;
            this._metrics.recordLoadError(this._cacheName);
            return entry.value;
        } finally {
            entry.loading = undefined;
        }
    }

    private _touch(key: TKey, entry: IEntry<TValue>): void {
        this._store.delete(key);
        this._store.set(key, entry);
    }
    private _insert(key: TKey, entry: IEntry<TValue>): void {
        this._store.set(key, entry);
        this._enforceMax();
    }

    private _enforceMax(): void {
        const max = this._options.maxEntries;
        if (!max) return;
        while (this._store.size > max) {
            const firstKey = this._store.keys().next().value as TKey | undefined;
            if (firstKey === undefined) break;
            this._store.delete(firstKey);
            this._evictions++;
            this._metrics.recordEviction?.(this._cacheName);
        }
    }

    // #endregion
}

/**
 * @private
 */
interface IEntry<T> {
    value: T;
    at: number;
    loaded?: boolean;
    loading?: Promise<T | undefined>;
}
