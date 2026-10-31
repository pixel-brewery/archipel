import { describe, expect, it } from 'vitest';
import { CACHE_DEFAULT_TTL_MS, CACHE_MAX_ENTRIES, CACHE_STALE_WHILE_REVALIDATE, PLATFORM_CACHING_CONFIG_ENTRIES } from './env.js';

describe('platform-caching env', () => {
    describe('config keys', () => {
        it('should resolve CACHE_DEFAULT_TTL_MS to the correct key string', () => {
            // assert
            expect(CACHE_DEFAULT_TTL_MS.key).toBe('CACHE_DEFAULT_TTL_MS');
        });

        it('should resolve CACHE_MAX_ENTRIES to the correct key string', () => {
            // assert
            expect(CACHE_MAX_ENTRIES.key).toBe('CACHE_MAX_ENTRIES');
        });

        it('should resolve CACHE_STALE_WHILE_REVALIDATE to the correct key string', () => {
            // assert
            expect(CACHE_STALE_WHILE_REVALIDATE.key).toBe('CACHE_STALE_WHILE_REVALIDATE');
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = ['CACHE_DEFAULT_TTL_MS', 'CACHE_MAX_ENTRIES', 'CACHE_STALE_WHILE_REVALIDATE'];

            // act
            const registeredKeys = PLATFORM_CACHING_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_CACHING_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should reference the correct config key instances', () => {
            // act
            const keyMap = new Map(PLATFORM_CACHING_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('CACHE_DEFAULT_TTL_MS')).toBe(CACHE_DEFAULT_TTL_MS);
            expect(keyMap.get('CACHE_MAX_ENTRIES')).toBe(CACHE_MAX_ENTRIES);
            expect(keyMap.get('CACHE_STALE_WHILE_REVALIDATE')).toBe(CACHE_STALE_WHILE_REVALIDATE);
        });

        it('should mark all keys as optional', () => {
            // assert
            for (const entry of PLATFORM_CACHING_CONFIG_ENTRIES) {
                expect(entry.required).toBe(false);
            }
        });

        it('should provide a default value for CACHE_STALE_WHILE_REVALIDATE', () => {
            // arrange
            const entry = PLATFORM_CACHING_CONFIG_ENTRIES.find((e) => e.key.key === 'CACHE_STALE_WHILE_REVALIDATE');

            // assert
            expect(entry).toBeDefined();
            expect(entry!.defaultValue).toBe(false);
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_CACHING_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
