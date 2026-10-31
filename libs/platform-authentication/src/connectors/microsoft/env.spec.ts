import { describe, expect, it } from 'vitest';
import {
    AUTH_MICROSOFT_CALLBACK_URL,
    AUTH_MICROSOFT_CLIENT_ID,
    AUTH_MICROSOFT_CLIENT_SECRET,
    AUTH_MICROSOFT_SCOPE,
    AUTH_MICROSOFT_STATE,
    AUTH_MICROSOFT_TENANT,
} from '../../env.js';
import { MICROSOFT_AUTH_CONFIG_ENTRIES } from './env.js';

describe('microsoft env', () => {
    describe('config entries', () => {
        it('should contain an entry for every Microsoft config key', () => {
            // arrange
            const expectedKeys = [
                'AUTH_MICROSOFT_CLIENT_ID',
                'AUTH_MICROSOFT_CLIENT_SECRET',
                'AUTH_MICROSOFT_CALLBACK_URL',
                'AUTH_MICROSOFT_TENANT',
                'AUTH_MICROSOFT_SCOPE',
                'AUTH_MICROSOFT_STATE',
            ];

            // act
            const registeredKeys = MICROSOFT_AUTH_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(MICROSOFT_AUTH_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(MICROSOFT_AUTH_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('AUTH_MICROSOFT_CLIENT_ID')).toBe(AUTH_MICROSOFT_CLIENT_ID);
            expect(keyMap.get('AUTH_MICROSOFT_CLIENT_SECRET')).toBe(AUTH_MICROSOFT_CLIENT_SECRET);
            expect(keyMap.get('AUTH_MICROSOFT_CALLBACK_URL')).toBe(AUTH_MICROSOFT_CALLBACK_URL);
            expect(keyMap.get('AUTH_MICROSOFT_TENANT')).toBe(AUTH_MICROSOFT_TENANT);
            expect(keyMap.get('AUTH_MICROSOFT_SCOPE')).toBe(AUTH_MICROSOFT_SCOPE);
            expect(keyMap.get('AUTH_MICROSOFT_STATE')).toBe(AUTH_MICROSOFT_STATE);
        });

        it('should mark credential keys as required', () => {
            // act
            const requiredKeys = MICROSOFT_AUTH_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('AUTH_MICROSOFT_CLIENT_ID');
            expect(requiredKeys).toContain('AUTH_MICROSOFT_CLIENT_SECRET');
        });

        it('should provide default values for optional keys', () => {
            // act
            const callbackEntry = MICROSOFT_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_MICROSOFT_CALLBACK_URL');
            const tenantEntry = MICROSOFT_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_MICROSOFT_TENANT');

            // assert
            expect(callbackEntry?.required).toBe(false);
            expect(callbackEntry?.defaultValue).toBe('/auth/microsoft/callback');
            expect(tenantEntry?.required).toBe(false);
            expect(tenantEntry?.defaultValue).toBe('common');
        });

        it('should provide a default value for the scope', () => {
            // act
            const scopeEntry = MICROSOFT_AUTH_CONFIG_ENTRIES.find((e) => e.key.key === 'AUTH_MICROSOFT_SCOPE');

            // assert
            expect(scopeEntry?.required).toBe(false);
            expect(scopeEntry?.defaultValue).toBe('user.read');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of MICROSOFT_AUTH_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
