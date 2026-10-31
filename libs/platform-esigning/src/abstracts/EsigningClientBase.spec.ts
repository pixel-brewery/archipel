// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { EsigningClientBase } from './EsigningClientBase.js';

// #endregion

// #region Tests

class TestEsigningClient extends EsigningClientBase {
    public readonly providerId = 'test-provider';

    public createSigningRequest = vi.fn();
    public createSigningSession = vi.fn();
    public getSigningRequest = vi.fn();
    public getSignedDocuments = vi.fn();
    public cancelSigningRequest = vi.fn();
    public verifyWebhook = vi.fn();
}

describe('EsigningClientBase', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have a default ping() that returns true', async () => {
        // arrange
        const client = new TestEsigningClient();

        // act
        const result = await client.ping();

        // assert
        expect(result).toBe(true);
    });
});

// #endregion
