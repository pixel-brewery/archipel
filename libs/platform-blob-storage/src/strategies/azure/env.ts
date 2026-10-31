// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Azure Blob Storage connection string. */
export const AZURE_BLOB_CONNECTION_STRING = createConfigKey<string>('AZURE_BLOB_CONNECTION_STRING');

/** Azure Blob Storage container name. */
export const AZURE_BLOB_CONTAINER_NAME = createConfigKey<string>('AZURE_BLOB_CONTAINER_NAME');

/** Configuration entries required by the Azure blob storage strategy. */
export const AZURE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AZURE_BLOB_CONNECTION_STRING, required: true, description: 'Azure Blob Storage connection string.' },
    { key: AZURE_BLOB_CONTAINER_NAME, required: true, description: 'Azure Blob Storage container name.' },
];

// #endregion
