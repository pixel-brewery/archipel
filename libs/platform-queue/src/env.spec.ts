// #region Imports

import { describe, expect, it } from 'vitest';

import { PLATFORM_QUEUE_CONFIG_ENTRIES, QUEUE_MAX_JOBS } from './env.js';

// #endregion

// #region Tests

describe('env', () => {
    describe('QUEUE_MAX_JOBS', () => {
        it('should be a valid config key', () => {
            // assert
            expect(QUEUE_MAX_JOBS).toBeDefined();
        });
    });

    describe('PLATFORM_QUEUE_CONFIG_ENTRIES', () => {
        it('should contain exactly one entry', () => {
            // assert
            expect(PLATFORM_QUEUE_CONFIG_ENTRIES).toHaveLength(1);
        });

        it('should reference the QUEUE_MAX_JOBS key', () => {
            // assert
            expect(PLATFORM_QUEUE_CONFIG_ENTRIES[0].key).toBe(QUEUE_MAX_JOBS);
        });

        it('should not require QUEUE_MAX_JOBS', () => {
            // assert
            expect(PLATFORM_QUEUE_CONFIG_ENTRIES[0].required).toBe(false);
        });
    });
});

// #endregion
