// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Stripe
// ──────────────────────────────────────────────────────────────

/** Stripe secret API key. */
export const STRIPE_API_KEY = createConfigKey<string>('STRIPE_API_KEY');

/** Stripe webhook signing secret. */
export const STRIPE_WEBHOOK_SECRET = createConfigKey<string>('STRIPE_WEBHOOK_SECRET');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Stripe payment provider. */
export const STRIPE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: STRIPE_API_KEY, required: true, description: 'Stripe secret API key.' },
    { key: STRIPE_WEBHOOK_SECRET, required: true, description: 'Stripe webhook signing secret.' },
];
