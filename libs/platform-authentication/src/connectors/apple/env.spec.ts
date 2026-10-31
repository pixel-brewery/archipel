import { describe, expect, it } from 'vitest';
import {
    AUTH_APPLE_CALLBACK_URL,
    AUTH_APPLE_CLIENT_ID,
    AUTH_APPLE_KEY_ID,
    AUTH_APPLE_PRIVATE_KEY,
    AUTH_APPLE_SCOPE,
    AUTH_APPLE_STATE,
    AUTH_APPLE_TEAM_ID,
} from '../../env.js';
import { APPLE_AUTH_CONFIG_ENTRIES } from './env.js';

describe('apple env', () => {
    describe('config entries', () => {
        it('should contain an entry for every Apple config key', () => {
            // arrange
            const expectedKeys = [
                'AUTH_APPLE_PRIVATE_KEY',
                'AUTH_APPLE_CLIENT_ID',
                'AUTH_APPLE_TEAM_ID',
                'AUTH_APPLE_KEY_ID',
                'AUTH_APPLE_CALLBACK_URL',
                'AUTH_APPLE_SCOPE',
                'AUTH_APPLE_STATE',
            ];

            // act
            const registeredKeys = APPLE_AUTH_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(APPLE_AUTH_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(APPLE_AUTH_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('AUTH_APPLE_PRIVATE_KEY')).toBe(AUTH_APPLE_PRIVATE_KEY);
            expect(keyMap.get('AUTH_APPLE_CLIENT_ID')).toBe(AUTH_APPLE_CLIENT_ID);
            expect(keyMap.get('AUTH_APPLE_TEAM_ID')).toBe(AUTH_APPLE_TEAM_ID);
            expect(keyMap.get('AUTH_APPLE_KEY_ID')).toBe(AUTH_APPLE_KEY_ID);
            expect(keyMap.get('AUTH_APPLE_CALLBACK_URL')).toBe(AUTH_APPLE_CALLBACK_URL);
            expect(keyMap.get('AUTH_APPLE_SCOPE')).toBe(AUTH_APPLE_SCOPE);
            expect(keyMap.get('AUTH_APPLE_STATE')).toBe(AUTH_APPLE_STATE);
        });

        it('should mark credential keys as required', () => {
            // act
            const requiredKeys = APPLE_AUTH_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('AUTH_APPLE_PRIVATE_KEY');
            expect(requiredKeys).toContain('AUTH_APPLE_CLIENT_ID');
            expect(requiredKeys).toContain('AUTH_APPLE_TEAM_ID');
            expect(requiredKeys).toContain('AUTH_APPLE_KEY_ID');
        });

        it('should provide a default value for the callback URL', () => {
            // act
            const callbackEntry = APPLE_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_APPLE_CALLBACK_URL');

            // assert
            expect(callbackEntry?.required).toBe(false);
            expect(callbackEntry?.defaultValue).toBe('/auth/apple/callback');
        });

        it('should provide a default value for the scope', () => {
            // act
            const scopeEntry = APPLE_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_APPLE_SCOPE');

            // assert
            expect(scopeEntry?.required).toBe(false);
            expect(scopeEntry?.defaultValue).toBe('name,email');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of APPLE_AUTH_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
