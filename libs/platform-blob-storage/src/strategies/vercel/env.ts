// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// #region Constants

/** Vercel Blob API URL. */
export const VERCEL_BLOB_URL = createConfigKey<string>('VERCEL_BLOB_URL');

/** Vercel Blob read/write access token. */
export const VERCEL_BLOB_READ_WRITE_TOKEN = createConfigKey<string>('VERCEL_BLOB_READ_WRITE_TOKEN');

/** Vercel Blob bucket name. */
export const VERCEL_BLOB_BUCKET = createConfigKey<string>('VERCEL_BLOB_BUCKET');

/** Vercel Blob region. */
export const VERCEL_BLOB_REGION = createConfigKey<string>('VERCEL_BLOB_REGION');

/** Vercel Blob public URL. */
export const VERCEL_BLOB_PUBLIC_URL = createConfigKey<string>('VERCEL_BLOB_PUBLIC_URL');

/** Configuration entries required by the Vercel blob storage strategy. */
export const VERCEL_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: VERCEL_BLOB_URL,
        required: true,
        defaultValue: 'https://blob.vercel-storage.com',
        description: 'Vercel Blob API URL.',
    },
    { key: VERCEL_BLOB_READ_WRITE_TOKEN, required: true, description: 'Vercel Blob read/write access token.' },
    { key: VERCEL_BLOB_BUCKET, required: false, description: 'Vercel Blob bucket name.' },
    { key: VERCEL_BLOB_REGION, required: false, description: 'Vercel Blob region.' },
    { key: VERCEL_BLOB_PUBLIC_URL, required: false, description: 'Vercel Blob public URL.' },
];

// #endregion
