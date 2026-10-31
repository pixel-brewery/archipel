import { describe, expect, it } from 'vitest';
import { AUTH_GITHUB_CALLBACK_URL, AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, AUTH_GITHUB_SCOPE, AUTH_GITHUB_STATE } from '../../env.js';
import { GITHUB_AUTH_CONFIG_ENTRIES } from './env.js';

describe('github env', () => {
    describe('config entries', () => {
        it('should contain an entry for every GitHub config key', () => {
            // arrange
            const expectedKeys = ['AUTH_GITHUB_CLIENT_ID', 'AUTH_GITHUB_CLIENT_SECRET', 'AUTH_GITHUB_CALLBACK_URL', 'AUTH_GITHUB_SCOPE', 'AUTH_GITHUB_STATE'];

            // act
            const registeredKeys = GITHUB_AUTH_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(GITHUB_AUTH_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(GITHUB_AUTH_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('AUTH_GITHUB_CLIENT_ID')).toBe(AUTH_GITHUB_CLIENT_ID);
            expect(keyMap.get('AUTH_GITHUB_CLIENT_SECRET')).toBe(AUTH_GITHUB_CLIENT_SECRET);
            expect(keyMap.get('AUTH_GITHUB_CALLBACK_URL')).toBe(AUTH_GITHUB_CALLBACK_URL);
            expect(keyMap.get('AUTH_GITHUB_SCOPE')).toBe(AUTH_GITHUB_SCOPE);
            expect(keyMap.get('AUTH_GITHUB_STATE')).toBe(AUTH_GITHUB_STATE);
        });

        it('should mark client ID and secret as required', () => {
            // arrange
            const requiredKeys = ['AUTH_GITHUB_CLIENT_ID', 'AUTH_GITHUB_CLIENT_SECRET'];

            // assert
            for (const entry of GITHUB_AUTH_CONFIG_ENTRIES) {
                if (requiredKeys.includes(entry.key.key)) {
                    expect(entry.required).toBe(true);
                }
            }
        });

        it('should mark callback URL as optional with a default value', () => {
            // arrange
            const callbackEntry = GITHUB_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_GITHUB_CALLBACK_URL');

            // assert
            expect(callbackEntry).toBeDefined();
            expect(callbackEntry?.required).toBe(false);
            expect(callbackEntry?.defaultValue).toBe('/auth/github/callback');
        });

        it('should mark scope as optional with a default value', () => {
            // arrange
            const scopeEntry = GITHUB_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_GITHUB_SCOPE');

            // assert
            expect(scopeEntry).toBeDefined();
            expect(scopeEntry?.required).toBe(false);
            expect(scopeEntry?.defaultValue).toBe('user:email');
        });

        it('should mark state as optional with a default value of "true"', () => {
            // arrange
            const stateEntry = GITHUB_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_GITHUB_STATE');

            // assert
            expect(stateEntry).toBeDefined();
            expect(stateEntry?.required).toBe(false);
            expect(stateEntry?.defaultValue).toBe('true');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of GITHUB_AUTH_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
