// #region Imports

import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { AZURE_FEATURE_FLAG_CONFIG_ENTRIES } from './azure/env.js';
import { VERCEL_FEATURE_FLAG_CONFIG_ENTRIES, VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES } from './vercel/env.js';

// #endregion

// ──────────────────────────────────────────────────────────────
// Re-exports
// ──────────────────────────────────────────────────────────────

export {
    AZURE_APPCONFIG_CONNECTION_STRING,
    AZURE_APPCONFIG_ENDPOINT,
    AZURE_FEATURE_FLAG_CONFIG_ENTRIES,
    AZURE_FEATURE_FLAG_KEY_FILTER,
    AZURE_FEATURE_FLAG_REFRESH_INTERVAL,
} from './azure/env.js';

export {
    VERCEL_API_TOKEN,
    VERCEL_EDGE_CONFIG,
    VERCEL_EDGE_CONFIG_ID,
    VERCEL_EDGE_CONFIG_TOKEN,
    VERCEL_FEATURE_FLAG_CONFIG_ENTRIES,
    VERCEL_FEATURE_FLAG_PREFIX,
    VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES,
    VERCEL_TEAM_ID,
} from './vercel/env.js';

// ──────────────────────────────────────────────────────────────
// Aggregated registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by the platform-feature-flags library across all providers. */
export const PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    ...AZURE_FEATURE_FLAG_CONFIG_ENTRIES,
    ...VERCEL_FEATURE_FLAG_CONFIG_ENTRIES,
    ...VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES,
];
