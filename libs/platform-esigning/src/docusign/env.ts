// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// DocuSign
// ──────────────────────────────────────────────────────────────

/** DocuSign integration key (client ID). */
export const DOCUSIGN_INTEGRATION_KEY = createConfigKey<string>('DOCUSIGN_INTEGRATION_KEY');

/** DocuSign secret key (client secret). */
export const DOCUSIGN_SECRET_KEY = createConfigKey<string>('DOCUSIGN_SECRET_KEY');

/** DocuSign account ID. */
export const DOCUSIGN_ACCOUNT_ID = createConfigKey<string>('DOCUSIGN_ACCOUNT_ID');

/** DocuSign base URL (e.g. https://demo.docusign.net for sandbox). */
export const DOCUSIGN_BASE_URL = createConfigKey<string>('DOCUSIGN_BASE_URL');

/** DocuSign webhook HMAC key. */
export const DOCUSIGN_WEBHOOK_HMAC_KEY = createConfigKey<string>('DOCUSIGN_WEBHOOK_HMAC_KEY');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the DocuSign e-signing provider. */
export const DOCUSIGN_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: DOCUSIGN_INTEGRATION_KEY, required: true, description: 'DocuSign integration key (client ID).' },
    { key: DOCUSIGN_SECRET_KEY, required: true, description: 'DocuSign secret key (client secret).' },
    { key: DOCUSIGN_ACCOUNT_ID, required: true, description: 'DocuSign account ID.' },
    { key: DOCUSIGN_BASE_URL, required: true, description: 'DocuSign base URL.' },
    { key: DOCUSIGN_WEBHOOK_HMAC_KEY, required: false, description: 'DocuSign webhook HMAC key.' },
];
