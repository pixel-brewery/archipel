// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { BlobResourceStrategy } from './BlobResourceStrategy.js';

// #endregion

// #region Tests

describe('BlobResourceStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have name "blob"', () => {
        // arrange
        const blobService = { downloadFile: vi.fn() } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act / assert
        expect(strategy.name).toBe('blob');
    });

    it('should throw on synchronous load', () => {
        // arrange
        const blobService = { downloadFile: vi.fn() } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act / assert
        expect(() => strategy.load('key')).toThrow();
    });

    it('should throw on synchronous exists', () => {
        // arrange
        const blobService = { downloadFile: vi.fn() } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act / assert
        expect(() => strategy.exists('key')).toThrow();
    });

    it('should load resource from blob storage asynchronously', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockResolvedValue({ data: Buffer.from('blob content'), contentType: 'text/plain' }),
        } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act
        const result = await strategy.loadAsync('file.txt');

        // assert
        expect(result).toBeDefined();
        expect(result!.content.toString()).toBe('blob content');
        expect(result!.metadata.mimeType).toBe('text/plain');
        expect(result!.metadata.source).toBe('blob');
    });

    it('should return undefined when data is empty', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockResolvedValue({ data: null }),
        } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act
        const result = await strategy.loadAsync('missing.txt');

        // assert
        expect(result).toBeUndefined();
    });

    it('should return undefined on download error', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockRejectedValue(new Error('not found')),
        } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act
        const result = await strategy.loadAsync('missing.txt');

        // assert
        expect(result).toBeUndefined();
    });

    it('should prefix key when keyPrefix is configured', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockResolvedValue({ data: Buffer.from('x') }),
        } as never;
        const strategy = new BlobResourceStrategy(blobService, { keyPrefix: 'resources/' });

        // act
        await strategy.loadAsync('file.txt');

        // assert
        expect(blobService.downloadFile).toHaveBeenCalledWith('resources/file.txt');
    });

    it('should check existence via existsAsync', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockResolvedValue({ data: Buffer.from('x') }),
        } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act
        const result = await strategy.existsAsync('exists.txt');

        // assert
        expect(result).toBe(true);
    });

    it('should return false from existsAsync on error', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockRejectedValue(new Error('not found')),
        } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act
        const result = await strategy.existsAsync('nope.txt');

        // assert
        expect(result).toBe(false);
    });

    it('should not throw on whatDoIHave', () => {
        // arrange
        const blobService = { downloadFile: vi.fn() } as never;
        const strategy = new BlobResourceStrategy(blobService);

        // act / assert
        expect(() => strategy.whatDoIHave()).not.toThrow();
    });
});

// #endregion
