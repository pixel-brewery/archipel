// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Vercel Queue Configuration Keys
// ──────────────────────────────────────────────────────────────

/**
 * Vercel region code (e.g. `iad1`, `fra1`, `sfo1`).
 *
 * @public
 */
export const VERCEL_QUEUE_REGION = createConfigKey<string>('VERCEL_QUEUE_REGION');

/**
 * Vercel OIDC bearer token for queue authentication.
 *
 * When omitted the SDK auto-fetches a token via OIDC.
 *
 * @public
 */
export const VERCEL_QUEUE_TOKEN = createConfigKey<string>('VERCEL_QUEUE_TOKEN');

/**
 * Consumer group name for receiving messages.
 *
 * @public
 */
export const VERCEL_QUEUE_CONSUMER_GROUP = createConfigKey<string>('VERCEL_QUEUE_CONSUMER_GROUP');

/**
 * Visibility timeout in seconds for received messages.
 *
 * The SDK automatically re-extends the lease while the handler runs.
 *
 * @defaultValue 300
 * @public
 */
export const VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS = createConfigKey<number>('VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS');

/**
 * Optional Vercel deployment ID for per-deployment message isolation.
 *
 * @public
 */
export const VERCEL_QUEUE_DEPLOYMENT_ID = createConfigKey<string>('VERCEL_QUEUE_DEPLOYMENT_ID');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/**
 * All configuration entries required by the Vercel queue provider.
 *
 * Pass this array to the module's `register()` method so that the
 * configuration service validates and provides the values at startup.
 *
 * @public
 */
export const VERCEL_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: VERCEL_QUEUE_REGION,
        required: true,
        description: 'Vercel region code (e.g. iad1, fra1, sfo1).',
    },
    {
        key: VERCEL_QUEUE_TOKEN,
        required: false,
        description: 'Vercel OIDC bearer token for queue authentication. Auto-fetched via OIDC when omitted.',
    },
    {
        key: VERCEL_QUEUE_CONSUMER_GROUP,
        required: true,
        description: 'Consumer group name for receiving messages.',
    },
    {
        key: VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
        required: false,
        defaultValue: 300,
        description: 'Visibility timeout in seconds for received messages. SDK auto-extends the lease.',
    },
    {
        key: VERCEL_QUEUE_DEPLOYMENT_ID,
        required: false,
        description: 'Optional Vercel deployment ID for per-deployment message isolation.',
    },
];
