// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { translateUniqueConstraintViolation } from './translateUniqueConstraintViolation.js';

// #endregion

// #region Tests

class NameAlreadyExistsError extends Error {}

describe('translateUniqueConstraintViolation', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the result of a write that succeeds', async () => {
        // arrange
        const createError = vi.fn(() => new NameAlreadyExistsError('taken'));

        // act
        const result = await translateUniqueConstraintViolation(() => Promise.resolve({ id: 7 }), createError);

        // assert
        expect(result).toEqual({ id: 7 });
        expect(createError).not.toHaveBeenCalled();
    });

    it.each([
        Object.assign(new Error('Unique constraint failed'), { name: 'PrismaClientKnownRequestError', code: 'P2002', clientVersion: '7.10.0' }),
        new RepositoryError('Prisma Client Known Request Error', 'R_KNOWN', undefined, RepositoryErrorKinds.UniqueConstraintViolation),
    ])('should report a unique constraint violation as the domain error', async (violation: Error) => {
        // arrange
        const createError = vi.fn(() => new NameAlreadyExistsError('taken'));

        // act
        const outcome = translateUniqueConstraintViolation(() => Promise.reject(violation), createError);

        // assert
        await expect(outcome).rejects.toBeInstanceOf(NameAlreadyExistsError);
        expect(createError).toHaveBeenCalledWith(violation);
    });

    it('should rethrow every other failure unchanged', async () => {
        // arrange
        const failure = Object.assign(new Error('Foreign key constraint failed'), { code: 'P2003' });
        const createError = vi.fn(() => new NameAlreadyExistsError('taken'));

        // act
        const outcome = translateUniqueConstraintViolation(() => Promise.reject(failure), createError);

        // assert
        await expect(outcome).rejects.toBe(failure);
        expect(createError).not.toHaveBeenCalled();
    });
});

// #endregion
