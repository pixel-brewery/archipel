import { describe, expect, it } from 'vitest';
import { AUTH_GOOGLE_CALLBACK_URL, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_GOOGLE_SCOPE, AUTH_GOOGLE_STATE } from '../../env.js';
import { GOOGLE_AUTH_CONFIG_ENTRIES } from './env.js';

describe('google env', () => {
    describe('config entries', () => {
        it('should contain an entry for every Google config key', () => {
            // arrange
            const expectedKeys = ['AUTH_GOOGLE_CLIENT_ID', 'AUTH_GOOGLE_CLIENT_SECRET', 'AUTH_GOOGLE_CALLBACK_URL', 'AUTH_GOOGLE_SCOPE', 'AUTH_GOOGLE_STATE'];

            // act
            const registeredKeys = GOOGLE_AUTH_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(GOOGLE_AUTH_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(GOOGLE_AUTH_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('AUTH_GOOGLE_CLIENT_ID')).toBe(AUTH_GOOGLE_CLIENT_ID);
            expect(keyMap.get('AUTH_GOOGLE_CLIENT_SECRET')).toBe(AUTH_GOOGLE_CLIENT_SECRET);
            expect(keyMap.get('AUTH_GOOGLE_CALLBACK_URL')).toBe(AUTH_GOOGLE_CALLBACK_URL);
            expect(keyMap.get('AUTH_GOOGLE_SCOPE')).toBe(AUTH_GOOGLE_SCOPE);
            expect(keyMap.get('AUTH_GOOGLE_STATE')).toBe(AUTH_GOOGLE_STATE);
        });

        it('should mark credential keys as required', () => {
            // act
            const requiredKeys = GOOGLE_AUTH_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('AUTH_GOOGLE_CLIENT_ID');
            expect(requiredKeys).toContain('AUTH_GOOGLE_CLIENT_SECRET');
        });

        it('should provide a default value for the callback URL', () => {
            // act
            const callbackEntry = GOOGLE_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_GOOGLE_CALLBACK_URL');

            // assert
            expect(callbackEntry?.required).toBe(false);
            expect(callbackEntry?.defaultValue).toBe('/auth/google/callback');
        });

        it('should provide a default value for the scope', () => {
            // act
            const scopeEntry = GOOGLE_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_GOOGLE_SCOPE');

            // assert
            expect(scopeEntry?.required).toBe(false);
            expect(scopeEntry?.defaultValue).toBe('email,profile');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of GOOGLE_AUTH_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
