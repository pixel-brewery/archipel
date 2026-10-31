import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BlobObjectPersistenceBase } from '../abstracts/BlobObjectPersistenceBase.js';
import type { BlobVariantPersistenceBase } from '../abstracts/BlobVariantPersistenceBase.js';
import { BlobObjectNotFoundError } from '../errors/BlobObjectNotFoundError.js';
import { BlobStorageError } from '../errors/BlobStorageError.js';
import { BlobStorageUnavailableError } from '../errors/BlobStorageUnavailableError.js';
import { BlobStorageUnsupportedOperationError } from '../errors/BlobStorageUnsupportedOperationError.js';
import type { IBlobObjectMetadata, IBlobUploadRequest, IBlobUploadResult } from '../interfaces/IBlobProvider.js';
import type { BlobStorageStrategyBase } from '../strategies/abstracts/BlobStorageStrategyBase.js';
import { BlobService } from './BlobService.js';

describe('BlobService', () => {
    // #region Fields

    let service: BlobService;
    let strategyMock: BlobStorageStrategyBase;
    let objectPersistenceMock: Partial<BlobObjectPersistenceBase>;
    let variantPersistenceMock: Partial<BlobVariantPersistenceBase>;
    let sampleMetadata: IBlobObjectMetadata;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        sampleMetadata = {
            provider: 'vercel',
            bucket: 'test-bucket',
            key: 'images/photo.png',
            size: 1024,
            contentType: 'image/png',
            isLatest: true,
        };

        strategyMock = {
            providerId: 'vercel',
            defaultBucket: 'default-bucket',
            uploadObject: vi.fn().mockResolvedValue({ metadata: sampleMetadata } satisfies IBlobUploadResult),
            downloadObject: vi.fn().mockResolvedValue({
                data: Buffer.from('data'),
                contentType: 'image/png',
            }),
            deleteObject: vi.fn().mockResolvedValue(undefined),
            objectExists: vi.fn().mockResolvedValue(true),
            createSignedUrl: vi.fn().mockResolvedValue('https://signed-url.example.com'),
        } as unknown as BlobStorageStrategyBase;

        objectPersistenceMock = {
            createFromMetadata: vi.fn().mockResolvedValue({ id: 'blob-1' }),
            markAsDeleted: vi.fn().mockResolvedValue(1),
        };

        variantPersistenceMock = {
            createFromMetadata: vi.fn().mockResolvedValue({ id: 'variant-1' }),
        };

        service = new BlobService(strategyMock, objectPersistenceMock as BlobObjectPersistenceBase, variantPersistenceMock as BlobVariantPersistenceBase);
    });

    it('should upload an object and persist metadata', async () => {
        // arrange
        const request: IBlobUploadRequest = {
            key: 'images/photo.png',
            body: Buffer.from('file-data'),
            contentType: 'image/png',
        };

        // act
        const result = await service.uploadObject(request);

        // assert
        expect(strategyMock.uploadObject).toHaveBeenCalledWith(request);
        expect(objectPersistenceMock.createFromMetadata).toHaveBeenCalledWith(sampleMetadata);
        expect(result.metadata).toEqual(sampleMetadata);
    });

    it('should upload a variant and persist variant metadata', async () => {
        // arrange
        const originalId = 'blob-1';
        const label = 'thumb_256';
        const request: IBlobUploadRequest = {
            key: 'images/photo_thumb.png',
            body: Buffer.from('thumb-data'),
            contentType: 'image/png',
        };

        // act
        const result = await service.uploadVariant(originalId, label, request);

        // assert
        expect(strategyMock.uploadObject).toHaveBeenCalledWith(request);
        expect(variantPersistenceMock.createFromMetadata).toHaveBeenCalledWith(originalId, label, sampleMetadata);
        expect(result.metadata).toEqual(sampleMetadata);
    });

    it('should delegate download to the strategy', async () => {
        // arrange
        const request = { key: 'images/photo.png' };

        // act
        const result = await service.downloadObject(request);

        // assert
        expect(strategyMock.downloadObject).toHaveBeenCalledWith(request);
        expect(result.contentType).toBe('image/png');
    });

    it('should delete an object and mark it as deleted', async () => {
        // arrange
        const request = { key: 'images/photo.png', bucket: 'my-bucket' };

        // act
        await service.deleteObject(request);

        // assert
        expect(strategyMock.deleteObject).toHaveBeenCalledWith(request);
        expect(objectPersistenceMock.markAsDeleted).toHaveBeenCalledWith('vercel', 'my-bucket', 'images/photo.png', undefined);
    });

    it('should use default bucket when no bucket is specified for delete', async () => {
        // arrange
        const request = { key: 'images/photo.png' };

        // act
        await service.deleteObject(request);

        // assert
        expect(objectPersistenceMock.markAsDeleted).toHaveBeenCalledWith('vercel', 'default-bucket', 'images/photo.png', undefined);
    });

    it('should create a signed URL via the strategy', async () => {
        // arrange
        const request = { key: 'images/photo.png' };

        // act
        const url = await service.createSignedUrl(request);

        // assert
        expect(strategyMock.createSignedUrl).toHaveBeenCalledWith(request);
        expect(strategyMock.objectExists).toHaveBeenCalledWith(request);
        expect(url).toBe('https://signed-url.example.com');
    });

    it('should throw when strategy does not support signed URLs', async () => {
        // arrange
        strategyMock.createSignedUrl = undefined as unknown as typeof strategyMock.createSignedUrl;
        const request = { key: 'images/photo.png' };

        // act & assert
        await expect(service.createSignedUrl(request)).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        expect(strategyMock.objectExists).not.toHaveBeenCalled();
    });

    it('should normalize a missing download into BlobObjectNotFoundError', async () => {
        // arrange
        vi.mocked(strategyMock.downloadObject).mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'ENOENT' }));

        // act & assert
        await expect(service.downloadObject({ key: 'missing.png' })).rejects.toMatchObject({
            code: 'BLOB_OBJECT_NOT_FOUND',
            key: 'missing.png',
            operation: 'download',
            providerId: 'vercel',
        });
    });

    it('should normalize a provider outage into BlobStorageUnavailableError', async () => {
        // arrange
        vi.mocked(strategyMock.downloadObject).mockRejectedValueOnce({ response: { status: 503 } });

        // act & assert
        await expect(service.downloadObject({ key: 'images/photo.png' })).rejects.toBeInstanceOf(BlobStorageUnavailableError);
    });

    it('should normalize an unknown provider failure into BlobStorageError', async () => {
        // arrange
        vi.mocked(strategyMock.uploadObject).mockRejectedValueOnce(new Error('provider implementation failed'));

        // act & assert
        await expect(service.uploadFile('images/photo.png', Buffer.from('data'))).rejects.toMatchObject({
            code: 'BLOB_STORAGE_OPERATION_FAILED',
            operation: 'upload',
        } satisfies Partial<BlobStorageError>);
    });

    it('should treat deleting an already missing object as success and update persistence', async () => {
        // arrange
        vi.mocked(strategyMock.deleteObject).mockRejectedValueOnce({ statusCode: 404 });

        // act
        await service.deleteObject({ key: 'already-gone.png' });

        // assert
        expect(objectPersistenceMock.markAsDeleted).toHaveBeenCalledWith('vercel', 'default-bucket', 'already-gone.png', undefined);
    });

    it('should return false when the provider reports a missing object', async () => {
        // arrange
        vi.mocked(strategyMock.objectExists).mockRejectedValueOnce({ name: 'NoSuchKey' });

        // act
        const exists = await service.objectExists({ key: 'missing.png' });

        // assert
        expect(exists).toBe(false);
    });

    it('should not convert an availability failure into a missing object', async () => {
        // arrange
        vi.mocked(strategyMock.objectExists).mockRejectedValueOnce(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' }));

        // act & assert
        await expect(service.objectExists({ key: 'images/photo.png' })).rejects.toBeInstanceOf(BlobStorageUnavailableError);
    });

    it('should reject signed URL creation when the object does not exist', async () => {
        // arrange
        vi.mocked(strategyMock.objectExists).mockResolvedValueOnce(false);

        // act & assert
        await expect(service.createSignedUrl({ key: 'missing.png' })).rejects.toBeInstanceOf(BlobObjectNotFoundError);
        expect(strategyMock.createSignedUrl).not.toHaveBeenCalled();
    });

    it('should upload a file via convenience method', async () => {
        // arrange
        const buffer = Buffer.from('file-data');

        // act
        await service.uploadFile('docs/readme.md', buffer, 'text/markdown');

        // assert
        expect(strategyMock.uploadObject).toHaveBeenCalledWith({
            key: 'docs/readme.md',
            body: buffer,
            contentType: 'text/markdown',
        });
    });

    it('should download a file via convenience method', async () => {
        // act
        const result = await service.downloadFile('docs/readme.md');

        // assert
        expect(strategyMock.downloadObject).toHaveBeenCalledWith({
            key: 'docs/readme.md',
            responseType: undefined,
        });
        expect(result.data).toBeDefined();
    });

    it('should delete a file via convenience method', async () => {
        // act
        await service.deleteFile('docs/readme.md');

        // assert
        expect(strategyMock.deleteObject).toHaveBeenCalledWith({
            key: 'docs/readme.md',
        });
    });

    it('should check whether a file exists via convenience method', async () => {
        // act
        const exists = await service.fileExists('docs/readme.md');

        // assert
        expect(exists).toBe(true);
        expect(strategyMock.objectExists).toHaveBeenCalledWith({ key: 'docs/readme.md' });
    });

    // #endregion

    describe('persistence isolation', () => {
        it('should keep an upload successful when the persistence port fails', async () => {
            const persistence = { createFromMetadata: vi.fn().mockRejectedValue(new Error('db down')), markAsDeleted: vi.fn() };
            const service = new BlobService(strategyMock as never, persistence as never, null);

            const result = await service.uploadObject({ key: 'a', body: Buffer.from('x') });

            expect(result.metadataPersisted).toBe(false);
            expect(persistence.createFromMetadata).toHaveBeenCalled();
        });

        it('should report a successful persistence on the upload result', async () => {
            const persistence = { createFromMetadata: vi.fn().mockResolvedValue(undefined), markAsDeleted: vi.fn() };
            const service = new BlobService(strategyMock as never, persistence as never, null);

            const result = await service.uploadObject({ key: 'a', body: Buffer.from('x') });

            expect(result.metadataPersisted).toBe(true);
        });

        it('should keep a deletion successful when the persistence port fails', async () => {
            const persistence = { createFromMetadata: vi.fn(), markAsDeleted: vi.fn().mockRejectedValue(new Error('db down')) };
            const service = new BlobService(strategyMock as never, persistence as never, null);

            await expect(service.deleteObject({ key: 'a' })).resolves.toBeUndefined();
        });
    });

    describe('listObjects', () => {
        it('should refuse listing when the strategy cannot enumerate', async () => {
            const service = new BlobService(strategyMock as never, null, null);

            await expect(service.listObjects({})).rejects.toThrow();
            expect(service.supports('listObjects')).toBe(false);
        });

        it('should delegate listing to a strategy that supports it', async () => {
            const listObjects = vi.fn().mockResolvedValue({ entries: [{ key: 'a', size: 5 }] });
            const service = new BlobService({ ...strategyMock, listObjects } as never, null, null);

            const result = await service.listObjects({ prefix: 'leads/' });

            expect(listObjects).toHaveBeenCalledWith({ prefix: 'leads/' });
            expect(result.entries).toHaveLength(1);
            expect(service.supports('listObjects')).toBe(true);
        });
    });
});
