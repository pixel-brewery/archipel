// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Google-specific API key. */
export const GOOGLE_API_KEY = createConfigKey<string>('GOOGLE_API_KEY');

/** Google-specific Gemini API key alias. */
export const GEMINI_API_KEY = createConfigKey<string>('GEMINI_API_KEY');

/** Google-specific base URL. */
export const GOOGLE_BASE_URL = createConfigKey<string>('GOOGLE_BASE_URL');

/** Configuration entries used by the Google intelligence provider. */
export const GOOGLE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: GOOGLE_API_KEY, required: false, description: 'Google Gemini API key.' },
    { key: GEMINI_API_KEY, required: false, description: 'Google Gemini API key alias.' },
    { key: GOOGLE_BASE_URL, required: false, description: 'Google Gemini API base URL override.' },
];

// #endregion
