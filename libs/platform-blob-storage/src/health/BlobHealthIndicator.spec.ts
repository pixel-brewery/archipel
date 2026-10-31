// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobHealthIndicator } from './BlobHealthIndicator.js';

// #endregion

// #region Tests

describe('BlobHealthIndicator', () => {
    let mockConfigService: { tryGet: ReturnType<typeof vi.fn> };
    let mockHttpHealthIndicator: { pingCheck: ReturnType<typeof vi.fn> };
    let indicator: BlobHealthIndicator;

    beforeEach(() => {
        mockConfigService = {
            tryGet: vi.fn().mockReturnValue(''),
        };
        mockHttpHealthIndicator = {
            pingCheck: vi.fn().mockResolvedValue({ blob: { status: 'up' } }),
        };
        indicator = new BlobHealthIndicator(mockConfigService as never, mockHttpHealthIndicator as never);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have key "blob"', () => {
        // assert
        expect(indicator.key).toBe('blob');
    });

    it('should return disabled status when blob URL is empty', async () => {
        // arrange
        mockConfigService.tryGet.mockReturnValue('');

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({ blob: { status: 'up', disabled: true } });
        expect(mockHttpHealthIndicator.pingCheck).not.toHaveBeenCalled();
    });

    it('should ping the blob URL when configured', async () => {
        // arrange
        mockConfigService.tryGet.mockReturnValue('https://blob.vercel-storage.com');

        // act
        await indicator.check();

        // assert
        expect(mockHttpHealthIndicator.pingCheck).toHaveBeenCalledWith('blob', 'https://blob.vercel-storage.com', {
            timeout: 2000,
        });
    });

    it('should return the result of pingCheck when URL is configured', async () => {
        // arrange
        mockConfigService.tryGet.mockReturnValue('https://blob.vercel-storage.com');
        mockHttpHealthIndicator.pingCheck.mockResolvedValue({ blob: { status: 'up' } });

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({ blob: { status: 'up' } });
    });

    it('should propagate errors from pingCheck', async () => {
        // arrange
        mockConfigService.tryGet.mockReturnValue('https://blob.vercel-storage.com');
        mockHttpHealthIndicator.pingCheck.mockRejectedValue(new Error('Connection refused'));

        // act & assert
        await expect(indicator.check()).rejects.toThrow('Connection refused');
    });
});

// #endregion
