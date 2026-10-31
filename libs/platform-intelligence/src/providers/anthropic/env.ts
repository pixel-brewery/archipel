// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Anthropic-specific API key. */
export const ANTHROPIC_API_KEY = createConfigKey<string>('ANTHROPIC_API_KEY');

/** Anthropic-specific base URL. */
export const ANTHROPIC_BASE_URL = createConfigKey<string>('ANTHROPIC_BASE_URL');

/** Configuration entries used by the Anthropic intelligence provider. */
export const ANTHROPIC_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: ANTHROPIC_API_KEY, required: false, description: 'Anthropic API key.' },
    { key: ANTHROPIC_BASE_URL, required: false, description: 'Anthropic API base URL override.' },
];

// #endregion
