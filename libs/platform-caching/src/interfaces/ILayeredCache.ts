// #region Imports

import { ICacheStats } from '../ICacheStats.js';

// #endregion

/**
 * Generic layered cache contract supporting synchronous and asynchronous
 * access patterns with optional warm-up and statistics.
 *
 * @public
 * @template TKey  The type of the cache keys.
 * @template TValue  The type of the cache values.
 */
export interface ILayeredCache<TKey, TValue> {
    // #region Methods

    /**
     * Retrieves a value from the cache synchronously.
     *
     * @public
     * @param key - The key to retrieve.
     * @returns The cached value or `undefined` on a miss.
     */
    get(key: TKey): TValue | undefined;

    /**
     * Retrieves a value from the cache asynchronously.
     *
     * @public
     * @param key - The key to retrieve.
     * @returns A promise resolving to the cached value or `undefined` on a miss.
     */
    getAsync(key: TKey): Promise<TValue | undefined>;

    /**
     * Stores a value in the cache synchronously.
     *
     * @public
     * @param key - The key to store.
     * @param value - The value to store.
     */
    set(key: TKey, value: TValue): void;

    /**
     * Stores a value in the cache asynchronously.
     *
     * @public
     * @param key - The key to store.
     * @param value - The value to store.
     */
    setAsync(key: TKey, value: TValue): Promise<void>;

    /**
     * Proactively warms the cache for a given key.
     *
     * @public
     * @param key - The key to warm.
     * @returns The value that was loaded and cached, or `undefined` if not found.
     */
    warm?(key: TKey): Promise<TValue | undefined>;

    /**
     * Invalidates a key in the cache synchronously.
     *
     * @public
     * @param key - The key to invalidate.
     */
    invalidate(key: TKey): void;

    /**
     * Invalidates a key in the cache asynchronously.
     *
     * @public
     * @param key - The key to invalidate.
     */
    invalidateAsync(key: TKey): Promise<void>;

    /**
     * Returns current cache statistics.
     *
     * @public
     * @returns The cache statistics snapshot.
     */
    stats?(): ICacheStats;

    // #endregion
}
