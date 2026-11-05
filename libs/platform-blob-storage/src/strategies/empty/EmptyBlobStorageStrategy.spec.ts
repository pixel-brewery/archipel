import { Logger } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobStorageDisabledError } from '../../errors/BlobStorageDisabledError.js';
import type { IBlobDeleteRequest, IBlobDownloadRequest, IBlobUploadRequest } from '../../interfaces/IBlobProvider.js';
import { EmptyBlobStorageStrategy } from './EmptyBlobStorageStrategy.js';

describe('EmptyBlobStorageStrategy', () => {
    // #region Fields

    let strategy: EmptyBlobStorageStrategy;
    let logSpy: ReturnType<typeof vi.spyOn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        strategy = new EmptyBlobStorageStrategy();
        logSpy = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    });
    afterEach(() => vi.restoreAllMocks());

    describe('providerId', () => {
        it('should return "empty" as the provider id', () => {
            // act & assert
            expect(strategy.providerId).toBe('empty');
        });
    });

    describe('defaultBucket', () => {
        it('should return undefined as the default bucket', () => {
            // act & assert
            expect(strategy.defaultBucket).toBeUndefined();
        });
    });

    describe('uploadObject', () => {
        it('reports a disabled upload without logging the private request', async () => {
            // arrange
            const request: IBlobUploadRequest = {
                key: 'private-object-path/sensitive-name.bin',
                body: Buffer.from('test-data'),
                contentType: 'image/png',
                contentLength: 9,
                metadata: { foo: 'bar' },
                checksumSha256: 'abc123',
                ownerUserId: 'user-1',
                bucket: 'my-bucket',
                region: 'eu-central-1',
            };

            // act
            const result = strategy.uploadObject(request);

            // assert
            expect(logSpy).toHaveBeenCalledOnce();
            expect(logSpy).toHaveBeenCalledWith({ operation: 'blobObject.upload', providerId: 'empty', result: 'disabled' });

            expect(JSON.stringify(logSpy.mock.calls)).not.toContain(request.key);
            expect(JSON.stringify(logSpy.mock.calls)).not.toContain('"foo"');
            expect(JSON.stringify(logSpy.mock.calls)).not.toContain('my-bucket');
            await expect(result).rejects.toBeInstanceOf(BlobStorageDisabledError);
        });

        it('should expose a stable disabled error code', async () => {
            // arrange
            const request: IBlobUploadRequest = {
                key: 'test/file.bin',
                body: Buffer.from('data'),
            };

            // act
            // act & assert
            await expect(strategy.uploadObject(request)).rejects.toMatchObject({
                code: 'BLOB_STORAGE_DISABLED',
                key: 'test/file.bin',
                operation: 'upload',
                providerId: 'empty',
            });
        });
    });

    describe('downloadObject', () => {
        it('reports a disabled download without logging the private request', async () => {
            // arrange
            const request: IBlobDownloadRequest = {
                key: 'test/image.png',
                versionId: 'v1',
                responseType: 'arraybuffer',
                bucket: 'my-bucket',
            };

            // act
            const result = strategy.downloadObject<Buffer>(request);

            // assert
            expect(logSpy).toHaveBeenCalledOnce();
            expect(logSpy).toHaveBeenCalledWith({ operation: 'blobObject.download', providerId: 'empty', result: 'disabled' });

            expect(JSON.stringify(logSpy.mock.calls)).not.toContain(request.key);
            await expect(result).rejects.toBeInstanceOf(BlobStorageDisabledError);
        });
    });

    describe('deleteObject', () => {
        it('reports a disabled deletion without logging the private request', async () => {
            // arrange
            const request: IBlobDeleteRequest = {
                key: 'test/image.png',
                versionId: 'v1',
                bucket: 'my-bucket',
            };

            // act
            const result = strategy.deleteObject(request);

            // assert
            expect(logSpy).toHaveBeenCalledOnce();
            expect(logSpy).toHaveBeenCalledWith({ operation: 'blobObject.delete', providerId: 'empty', result: 'disabled' });
            expect(JSON.stringify(logSpy.mock.calls)).not.toContain(request.key);
            await expect(result).rejects.toBeInstanceOf(BlobStorageDisabledError);
        });
    });

    describe('objectExists', () => {
        it('should not report a missing object when the provider is disabled', async () => {
            // arrange
            const request = { key: 'test/image.png' };

            // act
            const result = strategy.objectExists(request);

            // assert
            expect(logSpy).toHaveBeenCalledWith({ operation: 'blobObject.exists', providerId: 'empty', result: 'disabled' });
            await expect(result).rejects.toBeInstanceOf(BlobStorageDisabledError);
        });
    });

    // #endregion

    it('should refuse listing while storage is disabled', async () => {
        await expect(strategy.listObjects({ prefix: 'private-prefix/' })).rejects.toThrow();
        expect(logSpy).toHaveBeenCalledExactlyOnceWith({ operation: 'blobObject.list', providerId: 'empty', result: 'disabled' });
        expect(JSON.stringify(logSpy.mock.calls)).not.toContain('private-prefix/');
    });
});
