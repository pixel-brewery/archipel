// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// SendGrid
// ──────────────────────────────────────────────────────────────

/** API key for the SendGrid delivery service. */
export const SENDGRID_API_KEY = createConfigKey<string>('MAIL_SENDGRID_API_KEY');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the SendGrid delivery provider. */
export const SENDGRID_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: SENDGRID_API_KEY, required: true, description: 'SendGrid API key.' },
];
