// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

/**
 * Local blob storage base path.
 *
 * @public
 */
export const LOCAL_BLOB_BASE_PATH = createConfigKey<string>('LOCAL_BLOB_BASE_PATH');

/**
 * Local blob storage bucket (subdirectory).
 *
 * @public
 */
export const LOCAL_BLOB_BUCKET = createConfigKey<string>('LOCAL_BLOB_BUCKET');

/**
 * Configuration entries required by the local blob storage strategy.
 *
 * @public
 */
export const LOCAL_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: LOCAL_BLOB_BASE_PATH, required: true, description: 'Local blob storage base path.' },
    { key: LOCAL_BLOB_BUCKET, required: false, description: 'Local blob storage bucket (subdirectory).' },
];
