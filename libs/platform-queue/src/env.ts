// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Queue Configuration Keys
// ──────────────────────────────────────────────────────────────

/**
 * Maximum number of jobs retained in the in-memory queue before eviction.
 *
 * @defaultValue 10_000
 * @public
 */
export const QUEUE_MAX_JOBS = createConfigKey<number>('QUEUE_MAX_JOBS');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/**
 * All configuration entries required by `platform-queue`.
 *
 * Pass this array to the module's `register()` method so that the
 * configuration service validates and provides the values at startup.
 *
 * @public
 */
export const PLATFORM_QUEUE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: QUEUE_MAX_JOBS,
        required: false,
        defaultValue: 10_000,
        description: 'Maximum number of jobs retained in the in-memory queue before eviction.',
    },
];
