// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Logger } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobStorageUnsupportedOperationError } from '../../errors/BlobStorageUnsupportedOperationError.js';
import { AwsS3BlobStorageStrategy } from './AwsS3BlobStorageStrategy.js';
import { AWS_S3_BUCKET, AWS_S3_REGION } from './env.js';

// #endregion

const sdk = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('@aws-sdk/client-s3', () => ({
    S3Client: class {
        public readonly send = sdk.send;
    },
    PutObjectCommand: class {
        public constructor(public readonly input: Record<string, unknown>) {}
    },
    GetObjectCommand: class {
        public constructor(public readonly input: Record<string, unknown>) {}
    },
    ListObjectsV2Command: class {
        public constructor(public readonly input: Record<string, unknown>) {}
    },
    DeleteObjectCommand: class {
        public constructor(public readonly input: Record<string, unknown>) {}
    },
}));

describe('AwsS3BlobStorageStrategy', () => {
    let module: TestingModule;
    let strategy: AwsS3BlobStorageStrategy;
    beforeEach(async () => {
        vi.resetAllMocks();
        sdk.send.mockResolvedValue({ VersionId: 'actual-sdk-version', ETag: '"actual-sdk-etag"' });
        const values = new Map([
            [AWS_S3_BUCKET.key, 'private-bucket-name'],
            [AWS_S3_REGION.key, 'eu-central-1'],
        ]);
        module = await Test.createTestingModule({
            providers: [
                { provide: ConfigService, useValue: { get: (key: string) => values.get(key), tryGet: (_key: string, fallback: string) => fallback } },
                { provide: AwsS3BlobStorageStrategy, useFactory: (config: ConfigService) => new AwsS3BlobStorageStrategy(config), inject: [ConfigService] },
            ],
        }).compile();
        strategy = module.get(AwsS3BlobStorageStrategy);
    });
    afterEach(async () => {
        await module?.close();
        vi.restoreAllMocks();
    });

    it.each(['upload', 'delete'] as const)('preserves the S3 %s result without logging private key, bucket or metadata', async (operation) => {
        const key = 'private-object-path/sensitive-name.bin';
        const debug = vi.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);

        if (operation === 'upload') {
            const result = await strategy.uploadObject({ key, body: Buffer.from('private-content'), metadata: { privateField: 'sensitive-metadata' } });
            expect(result.metadata.key).toBe(key);
            expect(result.metadata.versionId).toBe('actual-sdk-version');
            expect(result.metadata.bucket).toBe('private-bucket-name');
        } else await expect(strategy.deleteObject({ key })).resolves.toBeUndefined();

        expect(sdk.send).toHaveBeenCalledWith(expect.objectContaining({ input: expect.objectContaining({ Key: key, Bucket: 'private-bucket-name' }) }));
        expect(debug).toHaveBeenCalledExactlyOnceWith({ operation: `blobObject.${operation}`, providerId: 'aws-s3', result: 'succeeded' });
        for (const privateValue of [key, 'private-bucket-name', 'private-content', 'sensitive-metadata'])
            expect(JSON.stringify(debug.mock.calls)).not.toContain(privateValue);
    });

    it.each([
        [
            'upload deadline',
            (adapter: AwsS3BlobStorageStrategy) => adapter.uploadObject({ key: 'records/object', body: Buffer.from('data'), execution: { timeoutMs: 10 } }),
        ],
        ['download deadline', (adapter: AwsS3BlobStorageStrategy) => adapter.downloadObject({ key: 'records/object', execution: { timeoutMs: 10 } })],
        ['download byte limit', (adapter: AwsS3BlobStorageStrategy) => adapter.downloadObject({ key: 'records/object', maxBytes: 0 })],
        ['listing deadline', (adapter: AwsS3BlobStorageStrategy) => adapter.listObjects({ prefix: 'records/', execution: { timeoutMs: 10 } })],
    ] as const)('rejects an explicit %s before contacting S3', async (_limit, invoke) => {
        const result = invoke(strategy);

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        expect(sdk.send).not.toHaveBeenCalled();
    });
});
