// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@prisma/client', () => {
    class MockPrismaClient {
        public $connect = vi.fn().mockResolvedValue(undefined);
        public $disconnect = vi.fn().mockResolvedValue(undefined);
        constructor(_options?: unknown) {
            /* noop */
        }
    }
    MockPrismaClient.prototype.$transaction = vi.fn().mockImplementation((arg: unknown) => {
        if (typeof arg === 'function') {
            return (arg as (tx: unknown) => unknown)({});
        }
        return Promise.resolve(arg);
    });
    return { PrismaClient: MockPrismaClient };
});

import { DatabaseService } from './DatabaseService.js';

// #endregion

// #region Tests

describe('DatabaseService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createService() {
        const configService = {
            tryGet: vi.fn().mockReturnValue(true),
        };

        return new DatabaseService(configService as never);
    }

    describe('transaction', () => {
        it('should delegate batch transaction to $transaction', async () => {
            // arrange
            const service = createService();
            const promises = [Promise.resolve(1), Promise.resolve(2)];

            // act
            const result = await service.transaction(promises as never);

            // assert
            expect(result).toBeDefined();
        });
    });

    describe('transactionCallback', () => {
        it('should delegate callback transaction to $transaction', async () => {
            // arrange
            const service = createService();
            const callback = vi.fn().mockResolvedValue({ id: '1' });

            // act
            const result = await service.transactionCallback(callback);

            // assert
            expect(callback).toHaveBeenCalled();
            expect(result).toEqual({ id: '1' });
        });
    });
});

// #endregion
