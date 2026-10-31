// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Logging
// ──────────────────────────────────────────────────────────────

/** Application log level (e.g. `'debug'`, `'info'`, `'warn'`, `'error'`). */
export const APP_LOG_LEVEL = createConfigKey<string>('APP_LOG_LEVEL');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-logging`. */
export const PLATFORM_LOGGING_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: APP_LOG_LEVEL, required: false, defaultValue: 'warn', description: 'Application log level.' },
];
