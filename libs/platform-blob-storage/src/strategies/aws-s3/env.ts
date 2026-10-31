// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

/**
 * AWS S3 region.
 *
 * @public
 */
export const AWS_S3_REGION = createConfigKey<string>('AWS_S3_REGION');

/**
 * AWS S3 bucket name.
 *
 * @public
 */
export const AWS_S3_BUCKET = createConfigKey<string>('AWS_S3_BUCKET');

/**
 * AWS S3 access key ID.
 *
 * @public
 */
export const AWS_S3_ACCESS_KEY_ID = createConfigKey<string>('AWS_S3_ACCESS_KEY_ID');

/**
 * AWS S3 secret access key.
 *
 * @public
 */
export const AWS_S3_SECRET_ACCESS_KEY = createConfigKey<string>('AWS_S3_SECRET_ACCESS_KEY');

/**
 * AWS S3 custom endpoint (for S3-compatible providers).
 *
 * @public
 */
export const AWS_S3_ENDPOINT = createConfigKey<string>('AWS_S3_ENDPOINT');

/**
 * Configuration entries required by the AWS S3 blob storage strategy.
 *
 * @public
 */
export const AWS_S3_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AWS_S3_REGION, required: true, description: 'AWS S3 region.' },
    { key: AWS_S3_BUCKET, required: true, description: 'AWS S3 bucket name.' },
    { key: AWS_S3_ACCESS_KEY_ID, required: false, description: 'AWS S3 access key ID.' },
    { key: AWS_S3_SECRET_ACCESS_KEY, required: false, description: 'AWS S3 secret access key.' },
    { key: AWS_S3_ENDPOINT, required: false, description: 'AWS S3 custom endpoint (for S3-compatible providers).' },
];
