// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Paddle
// ──────────────────────────────────────────────────────────────

/** Paddle API key. */
export const PADDLE_API_KEY = createConfigKey<string>('PADDLE_API_KEY');

/** Paddle webhook secret key. */
export const PADDLE_WEBHOOK_SECRET = createConfigKey<string>('PADDLE_WEBHOOK_SECRET');

/** Paddle environment (`production` or `sandbox`). Defaults to `production`. */
export const PADDLE_ENVIRONMENT = createConfigKey<string>('PADDLE_ENVIRONMENT');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Paddle payment provider. */
export const PADDLE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: PADDLE_API_KEY, required: true, description: 'Paddle API key.' },
    { key: PADDLE_WEBHOOK_SECRET, required: true, description: 'Paddle webhook secret key.' },
    {
        key: PADDLE_ENVIRONMENT,
        required: false,
        defaultValue: 'production',
        description: 'Paddle environment (production or sandbox).',
    },
];
