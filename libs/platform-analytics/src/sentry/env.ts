// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Sentry
// ──────────────────────────────────────────────────────────────

/** Sentry DSN for error tracking. */
export const SENTRY_DSN = createConfigKey<string>('SENTRY_DSN');

/** Sentry environment identifier (e.g. `production`, `staging`). */
export const SENTRY_ENVIRONMENT = createConfigKey<string>('SENTRY_ENVIRONMENT');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Sentry analytics provider. */
export const SENTRY_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: SENTRY_DSN, required: true, description: 'Sentry DSN for error tracking.' },
    {
        key: SENTRY_ENVIRONMENT,
        required: false,
        defaultValue: 'production',
        description: 'Sentry environment identifier.',
    },
];
