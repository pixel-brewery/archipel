import { describe, expect, it } from 'vitest';
import { APP_LOG_LEVEL, PLATFORM_LOGGING_CONFIG_ENTRIES } from './env.js';

describe('platform-logging env', () => {
    describe('config keys', () => {
        it('should resolve APP_LOG_LEVEL to the correct key string', () => {
            // assert
            expect(APP_LOG_LEVEL.key).toBe('APP_LOG_LEVEL');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['APP_LOG_LEVEL'];

            // act
            const registeredKeys = PLATFORM_LOGGING_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_LOGGING_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark APP_LOG_LEVEL as optional with a default', () => {
            // arrange
            const entry = PLATFORM_LOGGING_CONFIG_ENTRIES.find((e) => e.key.key === 'APP_LOG_LEVEL');

            // assert
            expect(entry?.required).toBe(false);
            expect(entry?.defaultValue).toBe('warn');
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_LOGGING_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
