// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Generic Caching Keys
// ──────────────────────────────────────────────────────────────

/** Default cache TTL in milliseconds applied when no provider-specific TTL is configured. */
export const CACHE_DEFAULT_TTL_MS = createConfigKey<number>('CACHE_DEFAULT_TTL_MS');

/** Maximum number of entries retained in an in-memory cache (LRU limit). */
export const CACHE_MAX_ENTRIES = createConfigKey<number>('CACHE_MAX_ENTRIES');

/** Whether expired entries are served while a background refresh is in progress. */
export const CACHE_STALE_WHILE_REVALIDATE = createConfigKey<boolean>('CACHE_STALE_WHILE_REVALIDATE');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-caching`. */
export const PLATFORM_CACHING_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: CACHE_DEFAULT_TTL_MS, required: false, description: 'Default cache TTL in milliseconds.' },
    { key: CACHE_MAX_ENTRIES, required: false, description: 'Maximum number of entries retained in an in-memory cache.' },
    {
        key: CACHE_STALE_WHILE_REVALIDATE,
        required: false,
        defaultValue: false,
        description: 'Whether expired entries are served while a background refresh is in progress.',
    },
];
