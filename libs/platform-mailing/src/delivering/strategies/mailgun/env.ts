// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Mailgun
// ──────────────────────────────────────────────────────────────

/** API key for the Mailgun delivery service. */
export const MAILGUN_API_KEY = createConfigKey<string>('MAIL_MAILGUN_API_KEY');

/** Mailgun domain (e.g. `mg.example.com`). */
export const MAILGUN_DOMAIN = createConfigKey<string>('MAIL_MAILGUN_DOMAIN');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Mailgun delivery provider. */
export const MAILGUN_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: MAILGUN_API_KEY, required: true, description: 'Mailgun API key.' },
    { key: MAILGUN_DOMAIN, required: true, description: 'Mailgun domain (e.g. mg.example.com).' },
];
