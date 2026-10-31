import { describe, expect, it } from 'vitest';
import {
    AZURE_APPCONFIG_CONNECTION_STRING,
    AZURE_APPCONFIG_ENDPOINT,
    AZURE_FEATURE_FLAG_CONFIG_ENTRIES,
    AZURE_FEATURE_FLAG_KEY_FILTER,
    AZURE_FEATURE_FLAG_REFRESH_INTERVAL,
    PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES,
    VERCEL_API_TOKEN,
    VERCEL_EDGE_CONFIG,
    VERCEL_EDGE_CONFIG_ID,
    VERCEL_EDGE_CONFIG_TOKEN,
    VERCEL_FEATURE_FLAG_CONFIG_ENTRIES,
    VERCEL_FEATURE_FLAG_PREFIX,
    VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES,
    VERCEL_TEAM_ID,
} from './env.js';

describe('platform-feature-flags env', () => {
    describe('config keys', () => {
        it('should resolve AZURE_APPCONFIG_ENDPOINT to the correct key string', () => {
            // assert
            expect(AZURE_APPCONFIG_ENDPOINT.key).toBe('AZURE_APPCONFIG_ENDPOINT');
        });

        it('should resolve AZURE_APPCONFIG_CONNECTION_STRING to the correct key string', () => {
            // assert
            expect(AZURE_APPCONFIG_CONNECTION_STRING.key).toBe('AZURE_APPCONFIG_CONNECTION_STRING');
        });

        it('should resolve AZURE_FEATURE_FLAG_REFRESH_INTERVAL to the correct key string', () => {
            // assert
            expect(AZURE_FEATURE_FLAG_REFRESH_INTERVAL.key).toBe('AZURE_FEATURE_FLAG_REFRESH_INTERVAL');
        });

        it('should resolve AZURE_FEATURE_FLAG_KEY_FILTER to the correct key string', () => {
            // assert
            expect(AZURE_FEATURE_FLAG_KEY_FILTER.key).toBe('AZURE_FEATURE_FLAG_KEY_FILTER');
        });

        it('should resolve VERCEL_EDGE_CONFIG to the correct key string', () => {
            // assert
            expect(VERCEL_EDGE_CONFIG.key).toBe('EDGE_CONFIG');
        });

        it('should resolve VERCEL_EDGE_CONFIG_TOKEN to the correct key string', () => {
            // assert
            expect(VERCEL_EDGE_CONFIG_TOKEN.key).toBe('VERCEL_EDGE_CONFIG_TOKEN');
        });

        it('should resolve VERCEL_FEATURE_FLAG_PREFIX to the correct key string', () => {
            // assert
            expect(VERCEL_FEATURE_FLAG_PREFIX.key).toBe('VERCEL_FEATURE_FLAG_PREFIX');
        });

        it('should resolve VERCEL_API_TOKEN to the correct key string', () => {
            // assert
            expect(VERCEL_API_TOKEN.key).toBe('VERCEL_API_TOKEN');
        });

        it('should resolve VERCEL_EDGE_CONFIG_ID to the correct key string', () => {
            // assert
            expect(VERCEL_EDGE_CONFIG_ID.key).toBe('VERCEL_EDGE_CONFIG_ID');
        });

        it('should resolve VERCEL_TEAM_ID to the correct key string', () => {
            // assert
            expect(VERCEL_TEAM_ID.key).toBe('VERCEL_TEAM_ID');
        });
    });

    describe('registry entries', () => {
        it('should contain all Azure entries', () => {
            // arrange
            const expectedKeys = [
                'AZURE_APPCONFIG_ENDPOINT',
                'AZURE_APPCONFIG_CONNECTION_STRING',
                'AZURE_FEATURE_FLAG_REFRESH_INTERVAL',
                'AZURE_FEATURE_FLAG_KEY_FILTER',
            ];

            // act
            const registeredKeys = AZURE_FEATURE_FLAG_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(AZURE_FEATURE_FLAG_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark all Azure keys as optional', () => {
            // assert
            for (const entry of AZURE_FEATURE_FLAG_CONFIG_ENTRIES) {
                expect(entry.required).toBe(false);
            }
        });

        it('should contain all Vercel reader entries', () => {
            // arrange
            const expectedKeys = ['EDGE_CONFIG', 'VERCEL_EDGE_CONFIG_TOKEN', 'VERCEL_FEATURE_FLAG_PREFIX'];

            // act
            const registeredKeys = VERCEL_FEATURE_FLAG_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(VERCEL_FEATURE_FLAG_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should contain all Vercel writer entries', () => {
            // arrange
            const expectedKeys = ['VERCEL_API_TOKEN', 'VERCEL_EDGE_CONFIG_ID', 'VERCEL_TEAM_ID', 'VERCEL_FEATURE_FLAG_PREFIX'];

            // act
            const registeredKeys = VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should aggregate all provider entries into PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES', () => {
            // arrange
            const expectedLength =
                AZURE_FEATURE_FLAG_CONFIG_ENTRIES.length + VERCEL_FEATURE_FLAG_CONFIG_ENTRIES.length + VERCEL_FEATURE_FLAG_WRITER_CONFIG_ENTRIES.length;

            // assert
            expect(PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES).toHaveLength(expectedLength);
        });

        it('should reference the correct config key instances in the aggregated array', () => {
            // act
            const keyMap = new Map(PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES.map((e) => [e.key.key, e.key]));

            // assert
            expect(keyMap.get('AZURE_APPCONFIG_ENDPOINT')).toBe(AZURE_APPCONFIG_ENDPOINT);
            expect(keyMap.get('AZURE_APPCONFIG_CONNECTION_STRING')).toBe(AZURE_APPCONFIG_CONNECTION_STRING);
            expect(keyMap.get('AZURE_FEATURE_FLAG_REFRESH_INTERVAL')).toBe(AZURE_FEATURE_FLAG_REFRESH_INTERVAL);
            expect(keyMap.get('AZURE_FEATURE_FLAG_KEY_FILTER')).toBe(AZURE_FEATURE_FLAG_KEY_FILTER);
            expect(keyMap.get('EDGE_CONFIG')).toBe(VERCEL_EDGE_CONFIG);
            expect(keyMap.get('VERCEL_EDGE_CONFIG_TOKEN')).toBe(VERCEL_EDGE_CONFIG_TOKEN);
            expect(keyMap.get('VERCEL_API_TOKEN')).toBe(VERCEL_API_TOKEN);
            expect(keyMap.get('VERCEL_EDGE_CONFIG_ID')).toBe(VERCEL_EDGE_CONFIG_ID);
            expect(keyMap.get('VERCEL_TEAM_ID')).toBe(VERCEL_TEAM_ID);
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_FEATURE_FLAGS_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
