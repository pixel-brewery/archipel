// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_CONFIG_ENTRIES, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET } from './env.js';

// #endregion

// #region Tests

describe('LemonSqueezy env', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have correct key strings', () => {
        // arrange / act / assert
        expect(LEMONSQUEEZY_API_KEY.key).toBe('LEMONSQUEEZY_API_KEY');
        expect(LEMONSQUEEZY_WEBHOOK_SECRET.key).toBe('LEMONSQUEEZY_WEBHOOK_SECRET');
        expect(LEMONSQUEEZY_STORE_ID.key).toBe('LEMONSQUEEZY_STORE_ID');
    });

    it('should have 3 required config entries', () => {
        // arrange / act / assert
        expect(LEMONSQUEEZY_CONFIG_ENTRIES).toHaveLength(3);
        expect(LEMONSQUEEZY_CONFIG_ENTRIES[0].required).toBe(true);
        expect(LEMONSQUEEZY_CONFIG_ENTRIES[1].required).toBe(true);
        expect(LEMONSQUEEZY_CONFIG_ENTRIES[2].required).toBe(true);
    });
});

// #endregion
