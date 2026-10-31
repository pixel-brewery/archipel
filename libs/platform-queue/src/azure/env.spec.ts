// #region Imports

import { describe, expect, it } from 'vitest';

import { AZURE_CONFIG_ENTRIES, AZURE_CONNECTION_STRING, AZURE_RECEIVE_WAIT_MS } from './env.js';

// #endregion

// #region Tests

describe('azure env', () => {
    describe('AZURE_CONNECTION_STRING', () => {
        it('should be a valid config key', () => {
            // assert
            expect(AZURE_CONNECTION_STRING).toBeDefined();
        });
    });

    describe('AZURE_RECEIVE_WAIT_MS', () => {
        it('should be a valid config key', () => {
            // assert
            expect(AZURE_RECEIVE_WAIT_MS).toBeDefined();
        });
    });

    describe('AZURE_CONFIG_ENTRIES', () => {
        it('should contain exactly two entries', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES).toHaveLength(2);
        });

        it('should reference the AZURE_CONNECTION_STRING key first', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES[0].key).toBe(AZURE_CONNECTION_STRING);
        });

        it('should require the AZURE_CONNECTION_STRING entry', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should reference the AZURE_RECEIVE_WAIT_MS key second', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES[1].key).toBe(AZURE_RECEIVE_WAIT_MS);
        });

        it('should not require the AZURE_RECEIVE_WAIT_MS entry', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES[1].required).toBe(false);
        });

        it('should default AZURE_RECEIVE_WAIT_MS to 5000', () => {
            // assert
            expect(AZURE_CONFIG_ENTRIES[1].defaultValue).toBe(5_000);
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of AZURE_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
