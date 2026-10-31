// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** MiMo-specific API key. */
export const MIMO_API_KEY = createConfigKey<string>('MIMO_API_KEY');

/** MiMo-specific base URL. */
export const MIMO_BASE_URL = createConfigKey<string>('MIMO_BASE_URL');

/** Configuration entries used by the MiMo intelligence provider. */
export const MIMO_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: MIMO_API_KEY, required: false, description: 'MiMo API key.' },
    { key: MIMO_BASE_URL, required: false, description: 'MiMo API base URL override.' },
];

// #endregion
