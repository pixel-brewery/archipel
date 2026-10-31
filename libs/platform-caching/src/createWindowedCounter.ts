// #region Imports

import { IWindowedCounter } from './interfaces/IWindowedCounter.js';
import { MemoryWindowedCounter } from './memory/MemoryWindowedCounter.js';
import { IPostgresWindowedCounterOptions, PostgresWindowedCounter } from './postgres/PostgresWindowedCounter.js';
import { IRedisWindowedCounterOptions, RedisWindowedCounter } from './redis/RedisWindowedCounter.js';

// #endregion

/**
 * Options for {@link createWindowedCounter}.
 *
 * @public
 */
export interface ICreateWindowedCounterOptions extends Partial<IRedisWindowedCounterOptions>, Partial<IPostgresWindowedCounterOptions> {
    /**
     * Redis connection URL. Used when no SQL client is supplied.
     *
     * @public
     */
    url?: string;
}

/**
 * Creates the windowed counter that fits the configured infrastructure.
 *
 * Choosing the implementation belongs to the platform, not to the feature that counts: a feature
 * deciding this itself would end up with its own idea of where limits live, and a deployment without
 * a shared store would silently get a different limit than the one configured.
 *
 * The order is deliberate. A SQL client is preferred over a Redis URL because an application that
 * has a database always has one, while a cache may be absent — and two stores counting the same
 * subject would enforce two different limits. Without either, the counter stays in process memory,
 * which is correct for a single instance and must be reported by the caller for several.
 *
 * @param options - Store configuration. Without a client and without a URL the in-memory counter is
 * returned.
 * @public
 */
export function createWindowedCounter(options: ICreateWindowedCounterOptions = {}): IWindowedCounter {
    if (options.client) {
        return new PostgresWindowedCounter({
            client: options.client,
            tableName: options.tableName,
            keyPrefix: options.keyPrefix,
        });
    }

    if (options.url) {
        return new RedisWindowedCounter({ url: options.url, keyPrefix: options.keyPrefix });
    }

    return new MemoryWindowedCounter();
}
