// #region Imports

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Logger } from '@nestjs/common';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobStorageUnsupportedOperationError } from '../../errors/BlobStorageUnsupportedOperationError.js';
import { LOCAL_BLOB_BASE_PATH, LOCAL_BLOB_BUCKET } from './env.js';
import { LocalBlobStorageStrategy } from './LocalBlobStorageStrategy.js';

// #endregion

describe('LocalBlobStorageStrategy', () => {
    // #region Fields

    let basePath: string;
    let strategy: LocalBlobStorageStrategy;

    // #endregion

    // #region Methods

    beforeEach(async () => {
        basePath = await mkdtemp(join(tmpdir(), 'archipel-blob-storage-'));

        const configService = {
            get: vi.fn((key: string) => (key === LOCAL_BLOB_BASE_PATH.key ? basePath : undefined)),
            tryGet: vi.fn((key: string) => (key === LOCAL_BLOB_BUCKET.key ? 'test-bucket' : undefined)),
        };

        strategy = new LocalBlobStorageStrategy(configService as unknown as ConfigService);
    });

    afterEach(async () => {
        vi.restoreAllMocks();
        await rm(basePath, { force: true, recursive: true });
    });

    it('rejects unsupported upload cancellation before creating any directories', async () => {
        const result = strategy.uploadObject({
            key: 'images/photo.png',
            body: Buffer.from('data'),
            execution: { abortSignal: AbortSignal.abort() },
        });

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        await expect(readdir(basePath)).resolves.toEqual([]);
    });

    it.each([
        ['a deadline', { execution: { timeoutMs: 1000 } }],
        ['a byte limit', { maxBytes: 0 }],
    ] as const)('rejects %s before looking up a download', async (_limit, options) => {
        const result = strategy.downloadObject({ key: 'images/missing.png', ...options });

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
    });

    describe('objectExists', () => {
        it('should return true for an uploaded file', async () => {
            // arrange
            await strategy.uploadObject({ key: 'images/photo.png', body: Buffer.from('data') });

            // act
            const exists = await strategy.objectExists({ key: 'images/photo.png' });

            // assert
            expect(exists).toBe(true);
        });

        it('should preserve the filesystem not-found signal for normalization by BlobService', async () => {
            // act & assert
            await expect(strategy.objectExists({ key: 'images/missing.png' })).rejects.toMatchObject({ code: 'ENOENT' });
        });
    });

    describe('deleteObject', () => {
        it('should preserve the filesystem not-found signal for idempotent handling by BlobService', async () => {
            // act & assert
            await expect(strategy.deleteObject({ key: 'images/missing.png' })).rejects.toMatchObject({ code: 'ENOENT' });
        });
    });

    it.each(['upload', 'delete'] as const)('preserves filesystem %s without logging the private key or base directory', async (operation) => {
        const key = 'sensitive-folder/private-document.bin';
        if (operation === 'delete') await strategy.uploadObject({ key, body: Buffer.from('private-content') });
        const debug = vi.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);

        if (operation === 'upload') {
            const result = await strategy.uploadObject({ key, body: Buffer.from('private-content') });
            expect(result.metadata.key).toBe(key);
            expect(result.metadata.size).toBe(15);
        } else await expect(strategy.deleteObject({ key })).resolves.toBeUndefined();

        expect(debug).toHaveBeenCalledExactlyOnceWith({ operation: `blobObject.${operation}`, providerId: 'local', result: 'succeeded' });
        const logged = JSON.stringify(debug.mock.calls);
        for (const privateValue of [key, basePath, 'test-bucket', 'private-content']) expect(logged).not.toContain(privateValue);
    });

    // #endregion

    describe('listObjects', () => {
        it('rejects an unsupported listing deadline', async () => {
            const result = strategy.listObjects({ execution: { timeoutMs: 1000 } });

            await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        });

        it('should enumerate stored objects across nested directories', async () => {
            await strategy.uploadObject({ key: 'leads/7/a.pdf', body: Buffer.from('aa') });
            await strategy.uploadObject({ key: 'leads/8/b.pdf', body: Buffer.from('bbbb') });
            await strategy.uploadObject({ key: 'tasks/1/c.pdf', body: Buffer.from('c') });

            const result = await strategy.listObjects({});

            expect(result.entries.map((entry) => entry.key).sort()).toEqual(['leads/7/a.pdf', 'leads/8/b.pdf', 'tasks/1/c.pdf']);
            expect(result.entries.find((entry) => entry.key === 'leads/8/b.pdf')?.size).toBe(4);
        });

        it('should restrict the listing to the requested prefix', async () => {
            await strategy.uploadObject({ key: 'leads/7/a.pdf', body: Buffer.from('a') });
            await strategy.uploadObject({ key: 'tasks/1/c.pdf', body: Buffer.from('c') });

            const result = await strategy.listObjects({ prefix: 'leads/' });

            expect(result.entries.map((entry) => entry.key)).toEqual(['leads/7/a.pdf']);
        });

        it('should page deterministically and stop when the listing is complete', async () => {
            await strategy.uploadObject({ key: 'a.txt', body: Buffer.from('1') });
            await strategy.uploadObject({ key: 'b.txt', body: Buffer.from('2') });
            await strategy.uploadObject({ key: 'c.txt', body: Buffer.from('3') });

            const first = await strategy.listObjects({ maxKeys: 2 });
            const second = await strategy.listObjects({ maxKeys: 2, continuationToken: first.continuationToken });

            expect(first.entries.map((entry) => entry.key)).toEqual(['a.txt', 'b.txt']);
            expect(first.continuationToken).toBe('b.txt');
            expect(second.entries.map((entry) => entry.key)).toEqual(['c.txt']);
            expect(second.continuationToken).toBeUndefined();
        });

        it('should return an empty listing when nothing is stored', async () => {
            const result = await strategy.listObjects({});

            expect(result.entries).toEqual([]);
            expect(result.continuationToken).toBeUndefined();
        });
    });
});
