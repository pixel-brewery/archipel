// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Resend
// ──────────────────────────────────────────────────────────────

/** API key for the Resend delivery service. */
export const RESEND_API_KEY = createConfigKey<string>('MAIL_RESEND_API_KEY');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Resend delivery provider. */
export const RESEND_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: RESEND_API_KEY, required: true, description: 'Resend API key.' },
];
