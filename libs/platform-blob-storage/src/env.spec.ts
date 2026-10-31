// #region Imports

import { describe, expect, it } from 'vitest';
import {
    AWS_S3_ACCESS_KEY_ID,
    AWS_S3_BUCKET,
    AWS_S3_ENDPOINT,
    AWS_S3_REGION,
    AWS_S3_SECRET_ACCESS_KEY,
    AZURE_BLOB_CONNECTION_STRING,
    AZURE_BLOB_CONTAINER_NAME,
    PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES,
    VERCEL_BLOB_BUCKET,
    VERCEL_BLOB_PUBLIC_URL,
    VERCEL_BLOB_READ_WRITE_TOKEN,
    VERCEL_BLOB_REGION,
    VERCEL_BLOB_URL,
} from './env.js';

// #endregion

// #region Tests

describe('platform-blob-storage env', () => {
    describe('config keys', () => {
        it('should resolve VERCEL_BLOB_URL to the correct key string', () => {
            // assert
            expect(VERCEL_BLOB_URL.key).toBe('VERCEL_BLOB_URL');
        });

        it('should resolve VERCEL_BLOB_READ_WRITE_TOKEN to the correct key string', () => {
            // assert
            expect(VERCEL_BLOB_READ_WRITE_TOKEN.key).toBe('VERCEL_BLOB_READ_WRITE_TOKEN');
        });

        it('should resolve VERCEL_BLOB_BUCKET to the correct key string', () => {
            // assert
            expect(VERCEL_BLOB_BUCKET.key).toBe('VERCEL_BLOB_BUCKET');
        });

        it('should resolve VERCEL_BLOB_REGION to the correct key string', () => {
            // assert
            expect(VERCEL_BLOB_REGION.key).toBe('VERCEL_BLOB_REGION');
        });

        it('should resolve VERCEL_BLOB_PUBLIC_URL to the correct key string', () => {
            // assert
            expect(VERCEL_BLOB_PUBLIC_URL.key).toBe('VERCEL_BLOB_PUBLIC_URL');
        });

        it('should resolve AZURE_BLOB_CONNECTION_STRING to the correct key string', () => {
            // assert
            expect(AZURE_BLOB_CONNECTION_STRING.key).toBe('AZURE_BLOB_CONNECTION_STRING');
        });

        it('should resolve AZURE_BLOB_CONTAINER_NAME to the correct key string', () => {
            // assert
            expect(AZURE_BLOB_CONTAINER_NAME.key).toBe('AZURE_BLOB_CONTAINER_NAME');
        });

        it('should resolve AWS_S3_REGION to the correct key string', () => {
            // assert
            expect(AWS_S3_REGION.key).toBe('AWS_S3_REGION');
        });

        it('should resolve AWS_S3_BUCKET to the correct key string', () => {
            // assert
            expect(AWS_S3_BUCKET.key).toBe('AWS_S3_BUCKET');
        });

        it('should resolve AWS_S3_ACCESS_KEY_ID to the correct key string', () => {
            // assert
            expect(AWS_S3_ACCESS_KEY_ID.key).toBe('AWS_S3_ACCESS_KEY_ID');
        });

        it('should resolve AWS_S3_SECRET_ACCESS_KEY to the correct key string', () => {
            // assert
            expect(AWS_S3_SECRET_ACCESS_KEY.key).toBe('AWS_S3_SECRET_ACCESS_KEY');
        });

        it('should resolve AWS_S3_ENDPOINT to the correct key string', () => {
            // assert
            expect(AWS_S3_ENDPOINT.key).toBe('AWS_S3_ENDPOINT');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = [
                'VERCEL_BLOB_URL',
                'VERCEL_BLOB_READ_WRITE_TOKEN',
                'VERCEL_BLOB_BUCKET',
                'VERCEL_BLOB_REGION',
                'VERCEL_BLOB_PUBLIC_URL',
                'AZURE_BLOB_CONNECTION_STRING',
                'AZURE_BLOB_CONTAINER_NAME',
                'AWS_S3_REGION',
                'AWS_S3_BUCKET',
                'AWS_S3_ACCESS_KEY_ID',
                'AWS_S3_SECRET_ACCESS_KEY',
                'AWS_S3_ENDPOINT',
                'LOCAL_BLOB_BASE_PATH',
                'LOCAL_BLOB_BUCKET',
            ];

            // act
            const registeredKeys = PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark all entries as optional', () => {
            // assert
            for (const entry of PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES) {
                expect(entry.required).toBe(false);
            }
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });

        it('should provide a default value for VERCEL_BLOB_URL', () => {
            // arrange
            const urlEntry = PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES.find((e) => e.key.key === 'VERCEL_BLOB_URL');

            // assert
            expect(urlEntry?.defaultValue).toBe('https://blob.vercel-storage.com');
        });

        it('should maintain the expected entry order', () => {
            // arrange
            const expectedOrder = [
                'VERCEL_BLOB_URL',
                'VERCEL_BLOB_READ_WRITE_TOKEN',
                'VERCEL_BLOB_BUCKET',
                'VERCEL_BLOB_REGION',
                'VERCEL_BLOB_PUBLIC_URL',
                'AZURE_BLOB_CONNECTION_STRING',
                'AZURE_BLOB_CONTAINER_NAME',
                'AWS_S3_REGION',
                'AWS_S3_BUCKET',
                'AWS_S3_ACCESS_KEY_ID',
                'AWS_S3_SECRET_ACCESS_KEY',
                'AWS_S3_ENDPOINT',
                'LOCAL_BLOB_BASE_PATH',
                'LOCAL_BLOB_BUCKET',
            ];

            // act
            const actualOrder = PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            expect(actualOrder).toEqual(expectedOrder);
        });
    });
});

// #endregion
