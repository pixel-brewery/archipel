// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// BullMQ Configuration Keys
// ──────────────────────────────────────────────────────────────

/**
 * Redis connection URL for BullMQ.
 *
 * @example `redis://localhost:6379`
 * @public
 */
export const BULLMQ_REDIS_URL = createConfigKey<string>('BULLMQ_REDIS_URL');

/**
 * Optional key prefix applied to all BullMQ queues in Redis.
 *
 * @defaultValue `''`
 * @public
 */
export const BULLMQ_PREFIX = createConfigKey<string>('BULLMQ_PREFIX');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/**
 * All configuration entries required by the BullMQ queue provider.
 *
 * Pass this array to the module's `register()` method so that the
 * configuration service validates and provides the values at startup.
 *
 * @public
 */
export const BULLMQ_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: BULLMQ_REDIS_URL,
        required: true,
        description: 'Redis connection URL for BullMQ (e.g. redis://localhost:6379).',
    },
    {
        key: BULLMQ_PREFIX,
        required: false,
        defaultValue: '',
        description: 'Optional key prefix applied to all BullMQ queues.',
    },
];
