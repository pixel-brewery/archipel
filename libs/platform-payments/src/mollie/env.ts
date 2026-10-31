// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Mollie
// ──────────────────────────────────────────────────────────────

/** Mollie API key. */
export const MOLLIE_API_KEY = createConfigKey<string>('MOLLIE_API_KEY');

/** Mollie webhook secret for verifying webhook payloads. */
export const MOLLIE_WEBHOOK_SECRET = createConfigKey<string>('MOLLIE_WEBHOOK_SECRET');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Mollie payment provider. */
export const MOLLIE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: MOLLIE_API_KEY, required: true, description: 'Mollie API key.' },
    { key: MOLLIE_WEBHOOK_SECRET, required: true, description: 'Mollie webhook secret for verification.' },
];
