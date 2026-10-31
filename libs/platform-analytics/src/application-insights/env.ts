// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Application Insights
// ──────────────────────────────────────────────────────────────

/** Application Insights connection string. */
export const APPLICATIONINSIGHTS_CONNECTION_STRING = createConfigKey<string>('APPLICATIONINSIGHTS_CONNECTION_STRING');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Application Insights analytics provider. */
export const APPINSIGHTS_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: APPLICATIONINSIGHTS_CONNECTION_STRING,
        required: true,
        description: 'Application Insights connection string.',
    },
];
