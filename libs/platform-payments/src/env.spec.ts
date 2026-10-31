import { describe, expect, it } from 'vitest';
import { PAYMENT_API_KEY, PAYMENT_WEBHOOK_SECRET, PLATFORM_PAYMENTS_CONFIG_ENTRIES } from './env.js';

describe('platform-payments env', () => {
    describe('config keys', () => {
        it('should resolve PAYMENT_API_KEY to the correct key string', () => {
            // assert
            expect(PAYMENT_API_KEY.key).toBe('PAYMENT_API_KEY');
        });

        it('should resolve PAYMENT_WEBHOOK_SECRET to the correct key string', () => {
            // assert
            expect(PAYMENT_WEBHOOK_SECRET.key).toBe('PAYMENT_WEBHOOK_SECRET');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['PAYMENT_API_KEY', 'PAYMENT_WEBHOOK_SECRET'];

            // act
            const registeredKeys = PLATFORM_PAYMENTS_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_PAYMENTS_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark all keys as required', () => {
            // assert
            for (const entry of PLATFORM_PAYMENTS_CONFIG_ENTRIES) {
                expect(entry.required).toBe(true);
            }
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_PAYMENTS_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
