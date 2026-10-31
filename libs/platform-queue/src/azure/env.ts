// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Azure Queue Configuration Keys
// ──────────────────────────────────────────────────────────────

/**
 * Azure queue connection string.
 *
 * @public
 */
export const AZURE_CONNECTION_STRING = createConfigKey<string>('AZURE_CONNECTION_STRING');

/**
 * Maximum wait time in milliseconds when receiving messages.
 *
 * @defaultValue 5_000
 * @public
 */
export const AZURE_RECEIVE_WAIT_MS = createConfigKey<number>('AZURE_RECEIVE_WAIT_MS');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/**
 * All configuration entries required by the Azure queue provider.
 *
 * Pass this array to the module's `register()` method so that the
 * configuration service validates and provides the values at startup.
 *
 * @public
 */
export const AZURE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: AZURE_CONNECTION_STRING,
        required: true,
        description: 'Azure queue connection string.',
    },
    {
        key: AZURE_RECEIVE_WAIT_MS,
        required: false,
        defaultValue: 5_000,
        description: 'Maximum wait time in milliseconds when receiving messages.',
    },
];
