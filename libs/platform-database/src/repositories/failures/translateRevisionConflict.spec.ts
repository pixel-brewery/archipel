// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { translateRevisionConflict } from './translateRevisionConflict.js';

// #endregion

// #region Tests

class RevisionConflictError extends Error {}

describe('translateRevisionConflict', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the result of a write whose revision still matches', async () => {
        // arrange
        const createError = vi.fn(() => new RevisionConflictError('stale'));

        // act
        const result = await translateRevisionConflict(() => Promise.resolve({ id: 3, revision: 2 }), createError);

        // assert
        expect(result).toEqual({ id: 3, revision: 2 });
        expect(createError).not.toHaveBeenCalled();
    });

    it.each([
        Object.assign(new Error('Record to update not found.'), { name: 'PrismaClientKnownRequestError', code: 'P2025', clientVersion: '7.10.0' }),
        new RepositoryError('Prisma Client Known Request Error', 'R_KNOWN', undefined, RepositoryErrorKinds.RecordNotFound),
    ])('should report a record that changed after it was read as the conflict', async (failure: Error) => {
        // arrange
        const createError = vi.fn(() => new RevisionConflictError('stale'));

        // act
        const outcome = translateRevisionConflict(() => Promise.reject(failure), createError);

        // assert
        await expect(outcome).rejects.toBeInstanceOf(RevisionConflictError);
        expect(createError).toHaveBeenCalledWith(failure);
    });

    it('should rethrow every other failure unchanged', async () => {
        // arrange
        const failure = Object.assign(new Error('Unique constraint failed'), { code: 'P2002' });
        const createError = vi.fn(() => new RevisionConflictError('stale'));

        // act
        const outcome = translateRevisionConflict(() => Promise.reject(failure), createError);

        // assert
        await expect(outcome).rejects.toBe(failure);
        expect(createError).not.toHaveBeenCalled();
    });
});

// #endregion
