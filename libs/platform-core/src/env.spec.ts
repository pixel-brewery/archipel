import { describe, expect, it } from 'vitest';
import { APP_NAME, APP_PORT, APP_URL, APP_VERSION, GIT_COMMIT, NODE_ENV, PLATFORM_CORE_CONFIG_ENTRIES } from './env.js';

describe('platform-core env', () => {
    describe('config keys', () => {
        it('should resolve APP_URL to the correct key string', () => {
            // assert
            expect(APP_URL.key).toBe('APP_URL');
        });

        it('should resolve APP_PORT to the correct key string', () => {
            // assert
            expect(APP_PORT.key).toBe('APP_PORT');
        });

        it('should resolve APP_VERSION to the correct key string', () => {
            // assert
            expect(APP_VERSION.key).toBe('APP_VERSION');
        });

        it('should resolve APP_NAME to the correct key string', () => {
            // assert
            expect(APP_NAME.key).toBe('APP_NAME');
        });

        it('should resolve NODE_ENV to the correct key string', () => {
            // assert
            expect(NODE_ENV.key).toBe('NODE_ENV');
        });

        it('should resolve GIT_COMMIT to the correct key string', () => {
            // assert
            expect(GIT_COMMIT.key).toBe('GIT_COMMIT');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['APP_URL', 'APP_PORT', 'APP_VERSION', 'APP_NAME', 'NODE_ENV', 'GIT_COMMIT'];

            // act
            const registeredKeys = PLATFORM_CORE_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_CORE_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark required keys correctly', () => {
            // act
            const requiredKeys = PLATFORM_CORE_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('APP_URL');
            expect(requiredKeys).toContain('APP_PORT');
            expect(requiredKeys).toContain('APP_VERSION');
            expect(requiredKeys).toContain('APP_NAME');
            expect(requiredKeys).not.toContain('NODE_ENV');
            expect(requiredKeys).not.toContain('GIT_COMMIT');
        });

        it('should provide default values for optional keys where applicable', () => {
            // act
            const optionalWithDefault = PLATFORM_CORE_CONFIG_ENTRIES.filter((e) => !e.required && e.defaultValue !== undefined);

            // assert
            expect(optionalWithDefault.length).toBeGreaterThan(0);
            const nodeEnv = optionalWithDefault.find((e) => e.key.key === 'NODE_ENV');
            expect(nodeEnv?.defaultValue).toBe('development');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_CORE_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
