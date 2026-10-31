// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Postmark
// ──────────────────────────────────────────────────────────────

/** API key for the Postmark delivery service. */
export const POSTMARK_API_KEY = createConfigKey<string>('MAIL_POSTMARK_API_KEY');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Postmark delivery provider. */
export const POSTMARK_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: POSTMARK_API_KEY, required: true, description: 'Postmark API key.' },
];
