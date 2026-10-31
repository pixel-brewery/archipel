// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Vercel Edge Config
// ──────────────────────────────────────────────────────────────

/** Vercel Edge Config connection string (includes store ID and token). */
export const VERCEL_EDGE_CONFIG = createConfigKey<string>('EDGE_CONFIG');

/** Optional: Vercel Edge Config read access token (when not embedded in connection string). */
export const VERCEL_EDGE_CONFIG_TOKEN = createConfigKey<string>('VERCEL_EDGE_CONFIG_TOKEN');

/** Optional: Prefix for feature flag keys in Edge Config. Defaults to `featureFlags`. */
export const VERCEL_FEATURE_FLAG_PREFIX = createConfigKey<string>('VERCEL_FEATURE_FLAG_PREFIX');

// ──────────────────────────────────────────────────────────────
// Vercel Edge Config Writer
// ──────────────────────────────────────────────────────────────

/** Vercel API token with write access to Edge Config. Required for write operations. */
export const VERCEL_API_TOKEN = createConfigKey<string>('VERCEL_API_TOKEN');

/** Vercel Edge Config store ID. Required for write operations. */
export const VERCEL_EDGE_CONFIG_ID = createConfigKey<string>('VERCEL_EDGE_CONFIG_ID');

/** Optional: Vercel Team ID for team-scoped API calls. */
export const VERCEL_TEAM_ID = createConfigKey<string>('VERCEL_TEAM_ID');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Vercel feature flag provider (read-only). */
export const VERCEL_FEATURE_FLAG_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: VERCEL_EDGE_CONFIG,
        required: true,
        description: 'Vercel Edge Config connection string.',
    },
    {
        key: VERCEL_EDGE_CONFIG_TOKEN,
        required: false,
        description: 'Vercel Edge Config read access token (when not embedded in connection string).',
    },
    {
        key: VERCEL_FEATURE_FLAG_PREFIX,
        required: false,
        description: 'Prefix for feature flag keys in Edge Config. Defaults to featureFlags.',
    },
];

/** Configuration entries required by the Vercel feature flag writer provider. */
export const VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: VERCEL_API_TOKEN,
        required: true,
        description: 'Vercel API token with write access to Edge Config.',
    },
    {
        key: VERCEL_EDGE_CONFIG_ID,
        required: true,
        description: 'Vercel Edge Config store ID.',
    },
    {
        key: VERCEL_TEAM_ID,
        required: false,
        description: 'Vercel Team ID for team-scoped API calls.',
    },
    {
        key: VERCEL_FEATURE_FLAG_PREFIX,
        required: false,
        description: 'Prefix for feature flag keys in Edge Config. Defaults to featureFlags.',
    },
];
