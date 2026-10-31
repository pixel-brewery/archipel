// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { PADDLE_API_KEY, PADDLE_CONFIG_ENTRIES, PADDLE_ENVIRONMENT, PADDLE_WEBHOOK_SECRET } from './env.js';

// #endregion

// #region Tests

describe('Paddle env', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have correct key strings', () => {
        // arrange / act / assert
        expect(PADDLE_API_KEY.key).toBe('PADDLE_API_KEY');
        expect(PADDLE_WEBHOOK_SECRET.key).toBe('PADDLE_WEBHOOK_SECRET');
        expect(PADDLE_ENVIRONMENT.key).toBe('PADDLE_ENVIRONMENT');
    });

    it('should have 3 config entries', () => {
        // arrange / act / assert
        expect(PADDLE_CONFIG_ENTRIES).toHaveLength(3);
    });

    it('should have first two entries as required', () => {
        // arrange / act / assert
        expect(PADDLE_CONFIG_ENTRIES[0].required).toBe(true);
        expect(PADDLE_CONFIG_ENTRIES[1].required).toBe(true);
    });

    it('should have environment entry as optional with default production', () => {
        // arrange
        const envEntry = PADDLE_CONFIG_ENTRIES.find((e) => e.key.key === 'PADDLE_ENVIRONMENT');

        // act / assert
        expect(envEntry!.required).toBe(false);
        expect(envEntry!.defaultValue).toBe('production');
    });
});

// #endregion
