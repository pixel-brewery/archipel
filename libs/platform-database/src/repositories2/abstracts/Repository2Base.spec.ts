// #region Imports

import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Repository2Base } from './Repository2Base.js';

// #endregion

// #region Tests

class TestRepository extends Repository2Base<{ findFirst: (args: unknown) => Promise<unknown> }> {
    public constructor(db: unknown, delegate: unknown) {
        super(db as never, delegate);
    }

    public get exposedDatabase(): unknown {
        return this.database;
    }

    public get exposedDelegate(): unknown {
        return this.delegate;
    }

    public exposedTryCatch<T>(promise: Promise<T>): Promise<T> {
        return this.tryCatch(promise);
    }
}

describe('Repository2Base', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should expose the database service via the protected getter', () => {
        // arrange
        const db = { $transaction: vi.fn() };
        const delegate = { findFirst: vi.fn() };

        // act
        const repo = new TestRepository(db, delegate);

        // assert
        expect(repo.exposedDatabase).toBe(db);
    });

    it('should expose the delegate via the protected getter', () => {
        // arrange
        const db = {};
        const delegate = { findFirst: vi.fn() };

        // act
        const repo = new TestRepository(db, delegate);

        // assert
        expect(repo.exposedDelegate).toBe(delegate);
    });

    describe('pipe', () => {
        it('should invoke the operator with the delegate and return the result', () => {
            // arrange
            const delegate = { findFirst: vi.fn() };
            const repo = new TestRepository({}, delegate);
            const operator = vi.fn().mockReturnValue('result');

            // act
            const result = repo.pipe(operator);

            // assert
            expect(operator).toHaveBeenCalledWith(delegate);
            expect(result).toBe('result');
        });
    });

    describe('execute', () => {
        it('should run the query with the delegate and return the result', async () => {
            // arrange
            const delegate = { findFirst: vi.fn() };
            const repo = new TestRepository({}, delegate);
            const query = {
                name: 'findUser',
                run: vi.fn().mockResolvedValue({ id: '1' }),
            };

            // act
            const result = await repo.execute(query as never);

            // assert
            expect(query.run).toHaveBeenCalledWith(delegate);
            expect(result).toEqual({ id: '1' });
        });

        it('should propagate errors from the query run', async () => {
            // arrange
            const delegate = { findFirst: vi.fn() };
            const repo = new TestRepository({}, delegate);
            vi.spyOn(Logger, 'error').mockImplementation(() => undefined);
            const query = {
                name: 'findUser',
                run: vi.fn().mockRejectedValue(new Error('DB error')),
            };

            // act / assert
            await expect(repo.execute(query as never)).rejects.toThrow('DB error');
        });
    });

    describe('tryCatch', () => {
        it('should return the resolved value on success', async () => {
            // arrange
            const repo = new TestRepository({}, { findFirst: vi.fn() });

            // act
            const result = await repo.exposedTryCatch(Promise.resolve(42));

            // assert
            expect(result).toBe(42);
        });

        it('should log and rethrow Error instances', async () => {
            // arrange
            const repo = new TestRepository({}, { findFirst: vi.fn() });
            const logSpy = vi.spyOn(Logger, 'error').mockImplementation(() => undefined);

            // act / assert
            await expect(repo.exposedTryCatch(Promise.reject(new Error('fail')))).rejects.toThrow('fail');
            expect(logSpy).toHaveBeenCalledWith('fail', expect.any(String), 'TestRepository');
        });

        it('should wrap non-Error throws in a new Error', async () => {
            // arrange
            const repo = new TestRepository({}, { findFirst: vi.fn() });
            const logSpy = vi.spyOn(Logger, 'error').mockImplementation(() => undefined);

            // act / assert
            await expect(repo.exposedTryCatch(Promise.reject('string error'))).rejects.toThrow('Unknown repository error');
            expect(logSpy).toHaveBeenCalled();
        });
    });
});

// #endregion
