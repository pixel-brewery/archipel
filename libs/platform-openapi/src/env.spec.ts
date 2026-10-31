import { describe, expect, it } from 'vitest';
import { APP_VERSION, PLATFORM_OPENAPI_CONFIG_ENTRIES, SWAGGER_CONTACT_EMAIL, SWAGGER_CONTACT_NAME, SWAGGER_CONTACT_URL } from './env.js';

describe('platform-openapi env', () => {
    describe('config keys', () => {
        it.each([
            ['APP_VERSION', APP_VERSION],
            ['SWAGGER_CONTACT_NAME', SWAGGER_CONTACT_NAME],
            ['SWAGGER_CONTACT_URL', SWAGGER_CONTACT_URL],
            ['SWAGGER_CONTACT_EMAIL', SWAGGER_CONTACT_EMAIL],
        ])('should resolve %s to the correct key string', (expected, configKey) => {
            // assert
            expect(configKey.key).toBe(expected);
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['APP_VERSION', 'SWAGGER_CONTACT_NAME', 'SWAGGER_CONTACT_URL', 'SWAGGER_CONTACT_EMAIL'];

            // act
            const registeredKeys = PLATFORM_OPENAPI_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_OPENAPI_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark all keys as required', () => {
            // assert
            for (const entry of PLATFORM_OPENAPI_CONFIG_ENTRIES) {
                expect(entry.required).toBe(true);
            }
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_OPENAPI_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
