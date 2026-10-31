// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Adobe Sign
// ──────────────────────────────────────────────────────────────

/** Adobe Sign integration key. */
export const ADOBE_SIGN_INTEGRATION_KEY = createConfigKey<string>('ADOBE_SIGN_INTEGRATION_KEY');

/** Adobe Sign client secret. */
export const ADOBE_SIGN_CLIENT_SECRET = createConfigKey<string>('ADOBE_SIGN_CLIENT_SECRET');

/** Adobe Sign base URL. */
export const ADOBE_SIGN_BASE_URL = createConfigKey<string>('ADOBE_SIGN_BASE_URL');

/** Adobe Sign webhook client ID for verification. */
export const ADOBE_SIGN_WEBHOOK_CLIENT_ID = createConfigKey<string>('ADOBE_SIGN_WEBHOOK_CLIENT_ID');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the Adobe Sign e-signing provider. */
export const ADOBE_SIGN_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: ADOBE_SIGN_INTEGRATION_KEY, required: true, description: 'Adobe Sign integration key.' },
    { key: ADOBE_SIGN_CLIENT_SECRET, required: true, description: 'Adobe Sign client secret.' },
    { key: ADOBE_SIGN_BASE_URL, required: true, description: 'Adobe Sign base URL.' },
    { key: ADOBE_SIGN_WEBHOOK_CLIENT_ID, required: true, description: 'Adobe Sign webhook client ID for verification.' },
];
