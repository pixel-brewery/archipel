// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Redis
// ──────────────────────────────────────────────────────────────

/** Redis connection URL (e.g. `redis://localhost:6379`). */
export const REDIS_URL = createConfigKey<string>('REDIS_URL');

/** Key prefix applied to all Redis keys managed by the cache instance. */
export const REDIS_KEY_PREFIX = createConfigKey<string>('REDIS_KEY_PREFIX');

/** TTL in seconds applied to every stored Redis entry. */
export const REDIS_TTL_SECONDS = createConfigKey<number>('REDIS_TTL_SECONDS');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Redis caching provider. */
export const REDIS_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: REDIS_URL, required: true, description: 'Redis connection URL.' },
    { key: REDIS_KEY_PREFIX, required: false, defaultValue: '', description: 'Key prefix for all Redis cache keys.' },
    { key: REDIS_TTL_SECONDS, required: false, description: 'TTL in seconds for Redis cache entries.' },
];
