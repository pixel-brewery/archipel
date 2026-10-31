// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { DatabaseHealthIndicator } from './DatabaseHealthIndicator.js';

// #endregion

// #region Tests

describe('DatabaseHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createIndicator(pingResult: unknown = { database: { status: 'up' } }) {
        const prismaHealthIndicator = {
            pingCheck: vi.fn().mockResolvedValue(pingResult),
        };
        const databaseService = {} as Record<string, unknown>;

        const indicator = new DatabaseHealthIndicator(prismaHealthIndicator as never, databaseService as never);

        return { indicator, prismaHealthIndicator, databaseService };
    }

    it('should have the key "database"', () => {
        // arrange
        const { indicator } = createIndicator();

        // act / assert
        expect(indicator.key).toBe('database');
    });

    it('should delegate to PrismaHealthIndicator.pingCheck', async () => {
        // arrange
        const expected = { database: { status: 'up' } };
        const { indicator, prismaHealthIndicator } = createIndicator(expected);

        // act
        const result = await indicator.check();

        // assert
        expect(prismaHealthIndicator.pingCheck).toHaveBeenCalledWith('database', expect.anything());
        expect(result).toEqual(expected);
    });

    it('should propagate errors from pingCheck', async () => {
        // arrange
        const prismaHealthIndicator = {
            pingCheck: vi.fn().mockRejectedValue(new Error('DB unreachable')),
        };
        const indicator = new DatabaseHealthIndicator(prismaHealthIndicator as never, {} as never);

        // act / assert
        await expect(indicator.check()).rejects.toThrow('DB unreachable');
    });
});

// #endregion
