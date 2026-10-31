import { describe, expect, it } from 'vitest';
import { BLOB_STORAGE_STRATEGY_TOKEN } from './BlobStorageTokens.js';

describe('blob storage tokens', () => {
    it('exposes a unique symbol token for the storage strategy', () => {
        expect(typeof BLOB_STORAGE_STRATEGY_TOKEN).toBe('symbol');
    });
});
