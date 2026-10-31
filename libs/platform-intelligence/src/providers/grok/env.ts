// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Grok-specific API key. */
export const GROK_API_KEY = createConfigKey<string>('GROK_API_KEY');

/** xAI-specific API key alias for Grok. */
export const XAI_API_KEY = createConfigKey<string>('XAI_API_KEY');

/** Grok-specific base URL. */
export const GROK_BASE_URL = createConfigKey<string>('GROK_BASE_URL');

/** xAI-specific base URL alias for Grok. */
export const XAI_BASE_URL = createConfigKey<string>('XAI_BASE_URL');

/** Configuration entries used by the Grok intelligence provider. */
export const GROK_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: GROK_API_KEY, required: false, description: 'Grok / xAI API key.' },
    { key: XAI_API_KEY, required: false, description: 'xAI API key alias for Grok.' },
    { key: GROK_BASE_URL, required: false, description: 'Grok / xAI API base URL override.' },
    { key: XAI_BASE_URL, required: false, description: 'xAI API base URL alias for Grok.' },
];

// #endregion
