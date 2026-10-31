// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';
import { AnalyticsHealthIndicator } from './AnalyticsHealthIndicator.js';

// #endregion

// #region Tests

describe('AnalyticsHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('key', () => {
        it('should expose the analytics key', () => {
            // arrange
            const indicator = new AnalyticsHealthIndicator();

            // assert
            expect(indicator.key).toBe('analytics');
        });
    });

    describe('check', () => {
        it('should return up with disabled flag when no client is configured', async () => {
            // arrange
            const indicator = new AnalyticsHealthIndicator();

            // act
            const result = await indicator.check();

            // assert
            expect(result).toEqual({
                analytics: {
                    status: 'up',
                    disabled: true,
                },
            });
        });

        it('should return up when the client ping succeeds', async () => {
            // arrange
            const client = {
                ping: vi.fn().mockResolvedValue(true),
            } as unknown as AnalyticsClientBase;
            const indicator = new AnalyticsHealthIndicator(client);

            // act
            const result = await indicator.check();

            // assert
            expect(result).toEqual({
                analytics: {
                    status: 'up',
                },
            });
            expect(client.ping).toHaveBeenCalledOnce();
        });

        it('should return down when the client ping returns false', async () => {
            // arrange
            const client = {
                ping: vi.fn().mockResolvedValue(false),
            } as unknown as AnalyticsClientBase;
            const indicator = new AnalyticsHealthIndicator(client);

            // act
            const result = await indicator.check();

            // assert
            expect(result).toEqual({
                analytics: {
                    status: 'down',
                },
            });
        });

        it('should return down with error message when the client ping throws', async () => {
            // arrange
            const client = {
                ping: vi.fn().mockRejectedValue(new Error('Connection refused')),
            } as unknown as AnalyticsClientBase;
            const indicator = new AnalyticsHealthIndicator(client);

            // act
            const result = await indicator.check();

            // assert
            expect(result).toEqual({
                analytics: {
                    status: 'down',
                    error: 'Connection refused',
                },
            });
        });
    });
});

// #endregion
