// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Dropbox Sign
// ──────────────────────────────────────────────────────────────

/** Dropbox Sign API key. */
export const DROPBOX_SIGN_API_KEY = createConfigKey<string>('DROPBOX_SIGN_API_KEY');

/** Dropbox Sign client ID. */
export const DROPBOX_SIGN_CLIENT_ID = createConfigKey<string>('DROPBOX_SIGN_CLIENT_ID');

/** Dropbox Sign webhook secret. */
export const DROPBOX_SIGN_WEBHOOK_SECRET = createConfigKey<string>('DROPBOX_SIGN_WEBHOOK_SECRET');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Dropbox Sign e-signing provider. */
export const DROPBOX_SIGN_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: DROPBOX_SIGN_API_KEY, required: true, description: 'Dropbox Sign API key.' },
    { key: DROPBOX_SIGN_CLIENT_ID, required: true, description: 'Dropbox Sign client ID.' },
    { key: DROPBOX_SIGN_WEBHOOK_SECRET, required: false, description: 'Dropbox Sign webhook secret.' },
];
