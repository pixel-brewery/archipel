import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BlobObjectPersistenceBase } from './abstracts/BlobObjectPersistenceBase.js';
import { BlobVariantPersistenceBase } from './abstracts/BlobVariantPersistenceBase.js';
import { BlobModule } from './BlobModule.js';
import type {
    IBlobDeleteRequest,
    IBlobDownloadRequest,
    IBlobDownloadResult,
    IBlobSignedUrlRequest,
    IBlobUploadRequest,
    IBlobUploadResult,
} from './interfaces/IBlobProvider.js';
import { BlobService } from './services/BlobService.js';
import { BlobStorageStrategyBase } from './strategies/abstracts/BlobStorageStrategyBase.js';

class StubBlobStorageStrategy extends BlobStorageStrategyBase {
    public readonly providerId = 'stub';

    public get defaultBucket(): string {
        return 'stub-bucket';
    }

    public async uploadObject(_request: IBlobUploadRequest): Promise<IBlobUploadResult> {
        return { metadata: { provider: 'stub', bucket: 'stub-bucket', key: 'k', size: 0, contentType: 'text/plain', isLatest: true }, rawResponse: {} };
    }

    public async downloadObject<TData>(_request: IBlobDownloadRequest): Promise<IBlobDownloadResult<TData>> {
        return { data: Buffer.from('') as TData, contentType: 'text/plain' };
    }

    public async deleteObject(_request: IBlobDeleteRequest): Promise<void> {
        // no-op
    }

    public async createSignedUrl(_request: IBlobSignedUrlRequest): Promise<string> {
        return 'https://signed.example.com';
    }
}
Injectable()(StubBlobStorageStrategy);

describe('BlobModule (DI Integration)', () => {
    // #region Methods

    afterEach(() => vi.restoreAllMocks());

    it('should resolve BlobService when register is called with a strategy', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                }),
                BlobModule.register({
                    storageStrategy: StubBlobStorageStrategy,
                    configEntries: [],
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({ get: () => '', tryGet: () => undefined, has: () => false })
            .compile();

        // act
        const service = moduleRef.get(BlobService);

        // assert
        expect(service).toBeInstanceOf(BlobService);
    });

    it.each(['object', 'variant'] as const)('persists %s metadata through the registered Nest adapter', async (kind) => {
        // arrange
        const persist = vi.fn().mockResolvedValue(undefined);
        // The abstract bases are registered in the same module as production; explicit injection must resolve nullable abstract bases.
        const definition = BlobModule.register({ storageStrategy: StubBlobStorageStrategy, configEntries: [] });
        definition.providers?.push(
            { provide: BlobObjectPersistenceBase, useValue: { createFromMetadata: persist } },
            { provide: BlobVariantPersistenceBase, useValue: { createFromMetadata: persist } },
        );
        const app = await Test.createTestingModule({ imports: [definition] })
            .overrideProvider(ConfigService)
            .useValue({ get: () => '', tryGet: () => undefined, has: () => false })
            .compile();
        const service = app.get(BlobService);
        const request = { key: 'k', body: Buffer.from('test'), contentType: 'text/plain' };
        try {
            // act
            const result = kind === 'object' ? await service.uploadObject(request) : await service.uploadVariant('original', 'thumb', request);
            // assert
            expect(result.metadataPersisted).toBe(true);
            expect(persist).toHaveBeenCalledExactlyOnceWith(...(kind === 'object' ? [result.metadata] : ['original', 'thumb', result.metadata]));
        } finally {
            await app.close();
        }
    });

    // #endregion
});
