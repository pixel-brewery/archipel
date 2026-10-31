// #region Imports

import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { AWS_S3_ACCESS_KEY_ID, AWS_S3_BUCKET, AWS_S3_ENDPOINT, AWS_S3_REGION, AWS_S3_SECRET_ACCESS_KEY } from './strategies/aws-s3/env.js';
import { AZURE_BLOB_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME } from './strategies/azure/env.js';
import { LOCAL_BLOB_BASE_PATH, LOCAL_BLOB_BUCKET } from './strategies/local/env.js';
import { VERCEL_BLOB_BUCKET, VERCEL_BLOB_PUBLIC_URL, VERCEL_BLOB_READ_WRITE_TOKEN, VERCEL_BLOB_REGION, VERCEL_BLOB_URL } from './strategies/vercel/env.js';

// #endregion

export { AWS_S3_ACCESS_KEY_ID, AWS_S3_BUCKET, AWS_S3_ENDPOINT, AWS_S3_REGION, AWS_S3_SECRET_ACCESS_KEY } from './strategies/aws-s3/env.js';
export { AZURE_BLOB_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME } from './strategies/azure/env.js';
export { LOCAL_BLOB_BASE_PATH, LOCAL_BLOB_BUCKET } from './strategies/local/env.js';
export { VERCEL_BLOB_BUCKET, VERCEL_BLOB_PUBLIC_URL, VERCEL_BLOB_READ_WRITE_TOKEN, VERCEL_BLOB_REGION, VERCEL_BLOB_URL } from './strategies/vercel/env.js';

/**
 * All configuration entries for `platform-blob-storage`. All keys are optional at the aggregate level.
 *
 * @public
 */
export const PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: VERCEL_BLOB_URL,
        required: false,
        defaultValue: 'https://blob.vercel-storage.com',
        description: 'Vercel Blob API URL.',
    },
    { key: VERCEL_BLOB_READ_WRITE_TOKEN, required: false, description: 'Vercel Blob read/write access token.' },
    { key: VERCEL_BLOB_BUCKET, required: false, description: 'Vercel Blob bucket name.' },
    { key: VERCEL_BLOB_REGION, required: false, description: 'Vercel Blob region.' },
    { key: VERCEL_BLOB_PUBLIC_URL, required: false, description: 'Vercel Blob public URL.' },
    { key: AZURE_BLOB_CONNECTION_STRING, required: false, description: 'Azure Blob Storage connection string.' },
    { key: AZURE_BLOB_CONTAINER_NAME, required: false, description: 'Azure Blob Storage container name.' },
    { key: AWS_S3_REGION, required: false, description: 'AWS S3 region.' },
    { key: AWS_S3_BUCKET, required: false, description: 'AWS S3 bucket name.' },
    { key: AWS_S3_ACCESS_KEY_ID, required: false, description: 'AWS S3 access key ID.' },
    { key: AWS_S3_SECRET_ACCESS_KEY, required: false, description: 'AWS S3 secret access key.' },
    { key: AWS_S3_ENDPOINT, required: false, description: 'AWS S3 custom endpoint (for S3-compatible providers).' },
    { key: LOCAL_BLOB_BASE_PATH, required: false, description: 'Local blob storage base path.' },
    { key: LOCAL_BLOB_BUCKET, required: false, description: 'Local blob storage bucket (subdirectory).' },
];
