// #region Imports

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis, type Redis as IRedis } from 'ioredis';
import { IWindowedCounter, IWindowedCounterResult } from '../interfaces/IWindowedCounter.js';

// #endregion

/**
 * Configuration options for {@link RedisWindowedCounter}.
 *
 * @public
 */
export interface IRedisWindowedCounterOptions {
    /**
     * Redis connection URL (e.g. `redis://localhost:6379`).
     *
     * @public
     */
    url: string;

    /**
     * Key prefix applied to all Redis keys managed by this counter.
     *
     * @public
     */
    keyPrefix?: string;
}

/**
 * Windowed counter shared by every instance through Redis.
 *
 * The increment and its expiry are issued as one pipeline, and `INCRBY` is atomic, so concurrent
 * instances cannot lose each other's writes. The expiry is set without overwriting an existing one,
 * which keeps the window anchored to its first increment instead of sliding forward with every call.
 *
 * A failing store must not become a way past the limit: an error is reported to the caller rather
 * than answered with a count of zero.
 *
 * @public
 */
@Injectable()
export class RedisWindowedCounter implements IWindowedCounter, OnModuleDestroy {
    // #region Fields

    private readonly _logger: Logger = new Logger(RedisWindowedCounter.name);
    private readonly _redis: IRedis;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link RedisWindowedCounter} class.
     *
     * @param options - Redis connection configuration.
     */
    public constructor(options: IRedisWindowedCounterOptions) {
        this._redis = new Redis(options.url, { keyPrefix: options.keyPrefix ?? '' });
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async increment(key: string, windowMs: number, amount = 1): Promise<IWindowedCounterResult> {
        const windowKey = this._formatKey(key, windowMs);
        const results = await this._redis.multi().incrby(windowKey, amount).pexpire(windowKey, windowMs, 'NX').exec();
        const value = results?.[0]?.[1];

        if (typeof value !== 'number') {
            throw new Error(`Windowed counter ${key} could not be incremented; the shared store returned no count.`);
        }

        return { value, resetAt: this._resolveResetAt(windowMs) };
    }

    /** @inheritdoc */
    public async peek(key: string, windowMs: number): Promise<IWindowedCounterResult> {
        const raw = await this._redis.get(this._formatKey(key, windowMs));
        const value = raw === null ? 0 : Number(raw);

        return { value: Number.isFinite(value) ? value : 0, resetAt: this._resolveResetAt(windowMs) };
    }

    /** @inheritdoc */
    public async reset(key: string, windowMs: number): Promise<void> {
        await this._redis.del(this._formatKey(key, windowMs));
    }

    /**
     * Closes the Redis connection when the module is destroyed.
     *
     * @public
     */
    public async onModuleDestroy(): Promise<void> {
        try {
            await this._redis.quit();
        } catch (error: unknown) {
            this._logger.warn(`redis quit failed err=${(error as Error).message}`);
        }
    }

    private _formatKey(key: string, windowMs: number): string {
        return `counter:${key}:${windowMs}:${Math.floor(Date.now() / windowMs)}`;
    }

    private _resolveResetAt(windowMs: number): Date {
        return new Date((Math.floor(Date.now() / windowMs) + 1) * windowMs);
    }

    // #endregion
}
