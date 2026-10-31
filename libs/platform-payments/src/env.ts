// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Generic Payment Keys
// ──────────────────────────────────────────────────────────────

/** Active payment-provider API key. */
export const PAYMENT_API_KEY = createConfigKey<string>('PAYMENT_API_KEY');

/** Active payment-provider webhook signing secret. */
export const PAYMENT_WEBHOOK_SECRET = createConfigKey<string>('PAYMENT_WEBHOOK_SECRET');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-payments`. */
export const PLATFORM_PAYMENTS_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: PAYMENT_API_KEY, required: true, description: 'Active payment-provider API key.' },
    { key: PAYMENT_WEBHOOK_SECRET, required: true, description: 'Active payment-provider webhook signing secret.' },
];
