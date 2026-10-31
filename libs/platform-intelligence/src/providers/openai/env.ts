// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** OpenAI-specific API key. */
export const OPENAI_API_KEY = createConfigKey<string>('OPENAI_API_KEY');

/** OpenAI-specific base URL. */
export const OPENAI_BASE_URL = createConfigKey<string>('OPENAI_BASE_URL');

/** Configuration entries used by the OpenAI intelligence provider. */
export const OPENAI_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: OPENAI_API_KEY, required: false, description: 'OpenAI API key.' },
    { key: OPENAI_BASE_URL, required: false, description: 'OpenAI API base URL override.' },
];

// #endregion
