// #region Imports

import { describe, expect, it } from 'vitest';

import { DATADOG_CONFIG_ENTRIES, DD_ENV, DD_SERVICE } from './env.js';

// #endregion

// #region Tests

describe('datadog env', () => {
    describe('DD_SERVICE', () => {
        it('should be a valid config key', () => {
            // assert
            expect(DD_SERVICE).toBeDefined();
        });
    });

    describe('DD_ENV', () => {
        it('should be a valid config key', () => {
            // assert
            expect(DD_ENV).toBeDefined();
        });
    });

    describe('DATADOG_CONFIG_ENTRIES', () => {
        it('should contain exactly two entries', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES).toHaveLength(2);
        });

        it('should reference the DD_SERVICE key first', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES[0].key).toBe(DD_SERVICE);
        });

        it('should require the DD_SERVICE entry', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should reference the DD_ENV key second', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES[1].key).toBe(DD_ENV);
        });

        it('should not require the DD_ENV entry', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES[1].required).toBe(false);
        });

        it('should default DD_ENV to production', () => {
            // assert
            expect(DATADOG_CONFIG_ENTRIES[1].defaultValue).toBe('production');
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of DATADOG_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
