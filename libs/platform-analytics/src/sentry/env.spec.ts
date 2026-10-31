// #region Imports

import { describe, expect, it } from 'vitest';

import { SENTRY_CONFIG_ENTRIES, SENTRY_DSN, SENTRY_ENVIRONMENT } from './env.js';

// #endregion

// #region Tests

describe('sentry env', () => {
    describe('SENTRY_DSN', () => {
        it('should be a valid config key', () => {
            // assert
            expect(SENTRY_DSN).toBeDefined();
        });
    });

    describe('SENTRY_ENVIRONMENT', () => {
        it('should be a valid config key', () => {
            // assert
            expect(SENTRY_ENVIRONMENT).toBeDefined();
        });
    });

    describe('SENTRY_CONFIG_ENTRIES', () => {
        it('should contain exactly two entries', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES).toHaveLength(2);
        });

        it('should reference the SENTRY_DSN key first', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES[0].key).toBe(SENTRY_DSN);
        });

        it('should require the SENTRY_DSN entry', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should reference the SENTRY_ENVIRONMENT key second', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES[1].key).toBe(SENTRY_ENVIRONMENT);
        });

        it('should not require the SENTRY_ENVIRONMENT entry', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES[1].required).toBe(false);
        });

        it('should default SENTRY_ENVIRONMENT to production', () => {
            // assert
            expect(SENTRY_CONFIG_ENTRIES[1].defaultValue).toBe('production');
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of SENTRY_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
