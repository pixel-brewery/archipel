// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Datadog
// ──────────────────────────────────────────────────────────────

/** Datadog service name. */
export const DD_SERVICE = createConfigKey<string>('DD_SERVICE');

/** Datadog environment identifier (e.g. `production`, `staging`). */
export const DD_ENV = createConfigKey<string>('DD_ENV');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Datadog analytics provider. */
export const DATADOG_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: DD_SERVICE, required: true, description: 'Datadog service name.' },
    { key: DD_ENV, required: false, defaultValue: 'production', description: 'Datadog environment identifier.' },
];
