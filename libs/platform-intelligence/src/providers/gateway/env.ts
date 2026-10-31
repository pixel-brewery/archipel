// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Vercel AI Gateway API key. */
export const AI_GATEWAY_API_KEY = createConfigKey<string>('AI_GATEWAY_API_KEY');

/** Vercel AI Gateway base URL. */
export const AI_GATEWAY_BASE_URL = createConfigKey<string>('AI_GATEWAY_BASE_URL');

/** Configuration entries used by the Vercel AI Gateway provider. */
export const AI_GATEWAY_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AI_GATEWAY_API_KEY, required: false, description: 'Vercel AI Gateway API key.' },
    { key: AI_GATEWAY_BASE_URL, required: false, description: 'Vercel AI Gateway base URL override.' },
];

// #endregion
