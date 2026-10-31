// #region Imports

import { describe, expect, it } from 'vitest';

import {
    VERCEL_CONFIG_ENTRIES,
    VERCEL_QUEUE_CONSUMER_GROUP,
    VERCEL_QUEUE_DEPLOYMENT_ID,
    VERCEL_QUEUE_REGION,
    VERCEL_QUEUE_TOKEN,
    VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS,
} from './env.js';

// #endregion

// #region Tests

describe('vercel env', () => {
    describe('VERCEL_QUEUE_REGION', () => {
        it('should be a valid config key', () => {
            // assert
            expect(VERCEL_QUEUE_REGION).toBeDefined();
        });
    });

    describe('VERCEL_QUEUE_TOKEN', () => {
        it('should be a valid config key', () => {
            // assert
            expect(VERCEL_QUEUE_TOKEN).toBeDefined();
        });
    });

    describe('VERCEL_QUEUE_CONSUMER_GROUP', () => {
        it('should be a valid config key', () => {
            // assert
            expect(VERCEL_QUEUE_CONSUMER_GROUP).toBeDefined();
        });
    });

    describe('VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS', () => {
        it('should be a valid config key', () => {
            // assert
            expect(VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS).toBeDefined();
        });
    });

    describe('VERCEL_QUEUE_DEPLOYMENT_ID', () => {
        it('should be a valid config key', () => {
            // assert
            expect(VERCEL_QUEUE_DEPLOYMENT_ID).toBeDefined();
        });
    });

    describe('VERCEL_CONFIG_ENTRIES', () => {
        it('should contain exactly five entries', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES).toHaveLength(5);
        });

        it('should reference the VERCEL_QUEUE_REGION key first', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[0].key).toBe(VERCEL_QUEUE_REGION);
        });

        it('should require the VERCEL_QUEUE_REGION entry', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[0].required).toBe(true);
        });

        it('should reference the VERCEL_QUEUE_TOKEN key second', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[1].key).toBe(VERCEL_QUEUE_TOKEN);
        });

        it('should not require the VERCEL_QUEUE_TOKEN entry', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[1].required).toBe(false);
        });

        it('should reference the VERCEL_QUEUE_CONSUMER_GROUP key third', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[2].key).toBe(VERCEL_QUEUE_CONSUMER_GROUP);
        });

        it('should require the VERCEL_QUEUE_CONSUMER_GROUP entry', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[2].required).toBe(true);
        });

        it('should reference the VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS key fourth', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[3].key).toBe(VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS);
        });

        it('should not require the VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS entry', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[3].required).toBe(false);
        });

        it('should default VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS to 300', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[3].defaultValue).toBe(300);
        });

        it('should reference the VERCEL_QUEUE_DEPLOYMENT_ID key fifth', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[4].key).toBe(VERCEL_QUEUE_DEPLOYMENT_ID);
        });

        it('should not require the VERCEL_QUEUE_DEPLOYMENT_ID entry', () => {
            // assert
            expect(VERCEL_CONFIG_ENTRIES[4].required).toBe(false);
        });

        it('should include a description for each entry', () => {
            // assert
            for (const entry of VERCEL_CONFIG_ENTRIES) {
                expect(entry.description).toBeDefined();
                expect(entry.description?.length).toBeGreaterThan(0);
            }
        });
    });
});

// #endregion
