// #region Imports

import { describe, expect, it } from 'vitest';

import { APPINSIGHTS_CONFIG_ENTRIES, APPLICATIONINSIGHTS_CONNECTION_STRING } from './env.js';

// #endregion

// #region Tests

describe('application-insights env', () => {
    describe('APPLICATIONINSIGHTS_CONNECTION_STRING', () => {
        it('should be a valid config key', () => {
            // assert
            expect(APPLICATIONINSIGHTS_CONNECTION_STRING).toBeDefined();
        });
    });

    describe('APPINSIGHTS_CONFIG_ENTRIES', () => {
        it('should contain exactly one entry', () => {
            // assert
            expect(APPINSIGHTS_CONFIG_ENTRIES).toHaveLength(1);
        });

        it('should reference the APPLICATIONINSIGHTS_CONNECTION_STRING key', () => {
            // assert
            expect(APPINSIGHTS_CONFIG_ENTRIES[0].key).toBe(APPLICATIONINSIGHTS_CONNECTION_STRING);
        });

        it('should require the APPLICATIONINSIGHTS_CONNECTION_STRING entry', () => {
            // assert
            expect(APPINSIGHTS_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of APPINSIGHTS_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
