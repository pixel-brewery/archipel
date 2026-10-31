// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOLLIE_API_KEY, MOLLIE_CONFIG_ENTRIES, MOLLIE_WEBHOOK_SECRET } from './env.js';

// #endregion

// #region Tests

describe('Mollie env', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have correct key strings', () => {
        // arrange / act / assert
        expect(MOLLIE_API_KEY.key).toBe('MOLLIE_API_KEY');
        expect(MOLLIE_WEBHOOK_SECRET.key).toBe('MOLLIE_WEBHOOK_SECRET');
    });

    it('should have 2 required config entries', () => {
        // arrange / act / assert
        expect(MOLLIE_CONFIG_ENTRIES).toHaveLength(2);
        expect(MOLLIE_CONFIG_ENTRIES[0].required).toBe(true);
        expect(MOLLIE_CONFIG_ENTRIES[1].required).toBe(true);
    });
});

// #endregion
