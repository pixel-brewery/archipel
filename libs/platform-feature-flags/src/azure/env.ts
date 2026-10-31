// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Azure App Configuration
// ──────────────────────────────────────────────────────────────

/** Azure App Configuration endpoint URL. Required when using Entra ID authentication. */
export const AZURE_APPCONFIG_ENDPOINT = createConfigKey<string>('AZURE_APPCONFIG_ENDPOINT');

/** Azure App Configuration connection string. Alternative to endpoint + Entra ID. */
export const AZURE_APPCONFIG_CONNECTION_STRING = createConfigKey<string>('AZURE_APPCONFIG_CONNECTION_STRING');

/** Refresh interval in milliseconds for feature flag state. Defaults to 30000. */
export const AZURE_FEATURE_FLAG_REFRESH_INTERVAL = createConfigKey<number>('AZURE_FEATURE_FLAG_REFRESH_INTERVAL');

/** Key filter for selecting feature flags. Defaults to `*` (all). */
export const AZURE_FEATURE_FLAG_KEY_FILTER = createConfigKey<string>('AZURE_FEATURE_FLAG_KEY_FILTER');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Azure feature flag provider. */
export const AZURE_FEATURE_FLAG_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: AZURE_APPCONFIG_ENDPOINT,
        required: false,
        description: 'Azure App Configuration endpoint URL. Required when using Entra ID authentication.',
    },
    {
        key: AZURE_APPCONFIG_CONNECTION_STRING,
        required: false,
        description: 'Azure App Configuration connection string. Alternative to endpoint + Entra ID.',
    },
    {
        key: AZURE_FEATURE_FLAG_REFRESH_INTERVAL,
        required: false,
        description: 'Refresh interval in milliseconds for feature flag state. Defaults to 30000.',
    },
    {
        key: AZURE_FEATURE_FLAG_KEY_FILTER,
        required: false,
        description: 'Key filter for selecting feature flags. Defaults to * (all).',
    },
];
