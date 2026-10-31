import { describe, expect, it } from 'vitest';
import { REDIS_CONFIG_ENTRIES, REDIS_KEY_PREFIX, REDIS_TTL_SECONDS, REDIS_URL } from './env.js';

describe('redis env', () => {
    describe('config keys', () => {
        it('should resolve REDIS_URL to the correct key string', () => {
            // assert
            expect(REDIS_URL.key).toBe('REDIS_URL');
        });

        it('should resolve REDIS_KEY_PREFIX to the correct key string', () => {
            // assert
            expect(REDIS_KEY_PREFIX.key).toBe('REDIS_KEY_PREFIX');
        });

        it('should resolve REDIS_TTL_SECONDS to the correct key string', () => {
            // assert
            expect(REDIS_TTL_SECONDS.key).toBe('REDIS_TTL_SECONDS');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['REDIS_URL', 'REDIS_KEY_PREFIX', 'REDIS_TTL_SECONDS'];

            // act
            const registeredKeys = REDIS_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(REDIS_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(REDIS_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('REDIS_URL')).toBe(REDIS_URL);
            expect(keyMap.get('REDIS_KEY_PREFIX')).toBe(REDIS_KEY_PREFIX);
            expect(keyMap.get('REDIS_TTL_SECONDS')).toBe(REDIS_TTL_SECONDS);
        });

        it('should mark REDIS_URL as required', () => {
            // arrange
            const entry = REDIS_CONFIG_ENTRIES.find((e) => e.key.key === 'REDIS_URL');

            // assert
            expect(entry).toBeDefined();
            expect(entry!.required).toBe(true);
        });

        it('should mark REDIS_KEY_PREFIX as optional with an empty string default', () => {
            // arrange
            const entry = REDIS_CONFIG_ENTRIES.find((e) => e.key.key === 'REDIS_KEY_PREFIX');

            // assert
            expect(entry).toBeDefined();
            expect(entry!.required).toBe(false);
            expect(entry!.defaultValue).toBe('');
        });

        it('should mark REDIS_TTL_SECONDS as optional', () => {
            // arrange
            const entry = REDIS_CONFIG_ENTRIES.find((e) => e.key.key === 'REDIS_TTL_SECONDS');

            // assert
            expect(entry).toBeDefined();
            expect(entry!.required).toBe(false);
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of REDIS_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
