// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// LemonSqueezy
// ──────────────────────────────────────────────────────────────

/** LemonSqueezy API key. */
export const LEMONSQUEEZY_API_KEY = createConfigKey<string>('LEMONSQUEEZY_API_KEY');

/** LemonSqueezy webhook signing secret. */
export const LEMONSQUEEZY_WEBHOOK_SECRET = createConfigKey<string>('LEMONSQUEEZY_WEBHOOK_SECRET');

/** LemonSqueezy store ID. */
export const LEMONSQUEEZY_STORE_ID = createConfigKey<string>('LEMONSQUEEZY_STORE_ID');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the LemonSqueezy payment provider. */
export const LEMONSQUEEZY_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: LEMONSQUEEZY_API_KEY, required: true, description: 'LemonSqueezy API key.' },
    { key: LEMONSQUEEZY_WEBHOOK_SECRET, required: true, description: 'LemonSqueezy webhook signing secret.' },
    { key: LEMONSQUEEZY_STORE_ID, required: true, description: 'LemonSqueezy store ID.' },
];
