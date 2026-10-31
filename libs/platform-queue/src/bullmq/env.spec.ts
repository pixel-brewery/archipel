// #region Imports

import { describe, expect, it } from 'vitest';

import { BULLMQ_CONFIG_ENTRIES, BULLMQ_PREFIX, BULLMQ_REDIS_URL } from './env.js';

// #endregion

// #region Tests

describe('bullmq env', () => {
    describe('BULLMQ_REDIS_URL', () => {
        it('should be a valid config key', () => {
            // assert
            expect(BULLMQ_REDIS_URL).toBeDefined();
        });
    });

    describe('BULLMQ_PREFIX', () => {
        it('should be a valid config key', () => {
            // assert
            expect(BULLMQ_PREFIX).toBeDefined();
        });
    });

    describe('BULLMQ_CONFIG_ENTRIES', () => {
        it('should contain exactly two entries', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES).toHaveLength(2);
        });

        it('should reference the BULLMQ_REDIS_URL key first', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES[0].key).toBe(BULLMQ_REDIS_URL);
        });

        it('should require the BULLMQ_REDIS_URL entry', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should reference the BULLMQ_PREFIX key second', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES[1].key).toBe(BULLMQ_PREFIX);
        });

        it('should not require the BULLMQ_PREFIX entry', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES[1].required).toBe(false);
        });

        it('should default BULLMQ_PREFIX to an empty string', () => {
            // assert
            expect(BULLMQ_CONFIG_ENTRIES[1].defaultValue).toBe('');
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of BULLMQ_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
