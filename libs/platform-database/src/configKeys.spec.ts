// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { DB_AUTO_CONNECTION, PLATFORM_DATABASE_CONFIG_ENTRIES } from './configKeys.js';

// #endregion

// #region Tests

describe('platform-database configKeys', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should expose DB_AUTO_CONNECTION with the correct key string', () => {
        // arrange / act
        const key = DB_AUTO_CONNECTION;

        // assert
        expect(key.key).toBe('DB_AUTO_CONNECTION');
    });

    it('should contain an entry for DB_AUTO_CONNECTION', () => {
        // arrange / act
        const entry = PLATFORM_DATABASE_CONFIG_ENTRIES.find((e) => e.key.key === 'DB_AUTO_CONNECTION');

        // assert
        expect(entry).toBeDefined();
        expect(entry!.required).toBe(false);
        expect(entry!.defaultValue).toBe(true);
    });

    it('should include a description for every entry', () => {
        // arrange / act / assert
        for (const entry of PLATFORM_DATABASE_CONFIG_ENTRIES) {
            expect(entry.description).toBeTruthy();
        }
    });
});

// #endregion
