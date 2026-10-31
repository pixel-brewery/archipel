// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { EsigningHealthIndicator } from './EsigningHealthIndicator.js';

// #endregion

// #region Tests

describe('EsigningHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have the key "esigning"', () => {
        // arrange / act
        const indicator = new EsigningHealthIndicator();

        // assert
        expect(indicator.key).toBe('esigning');
    });

    it('should return disabled status when no client is configured', async () => {
        // arrange
        const indicator = new EsigningHealthIndicator();

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            esigning: {
                status: 'up',
                disabled: true,
            },
        });
    });

    it('should return "up" when client ping succeeds with true', async () => {
        // arrange
        const client = {
            ping: vi.fn().mockResolvedValue(true),
            providerId: 'docusign',
        };
        const indicator = new EsigningHealthIndicator(client as never);

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            esigning: {
                status: 'up',
                provider: 'docusign',
            },
        });
    });

    it('should return "down" when client ping succeeds with false', async () => {
        // arrange
        const client = {
            ping: vi.fn().mockResolvedValue(false),
            providerId: 'adobe-sign',
        };
        const indicator = new EsigningHealthIndicator(client as never);

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            esigning: {
                status: 'down',
                provider: 'adobe-sign',
            },
        });
    });

    it('should return "down" with error message when client ping throws', async () => {
        // arrange
        const client = {
            ping: vi.fn().mockRejectedValue(new Error('Connection refused')),
            providerId: 'dropbox-sign',
        };
        const indicator = new EsigningHealthIndicator(client as never);

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            esigning: {
                status: 'down',
                provider: 'dropbox-sign',
                error: 'Connection refused',
            },
        });
    });
});

// #endregion
