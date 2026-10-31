// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { isUniqueConstraintViolation } from './isUniqueConstraintViolation.js';

// #endregion

// #region Tests

describe('isUniqueConstraintViolation', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each([
        { name: 'PrismaClientKnownRequestError', message: 'Unique constraint failed', code: 'P2002', clientVersion: '7.10.0' },
        new RepositoryError('Prisma Client Known Request Error', 'R_KNOWN', undefined, RepositoryErrorKinds.UniqueConstraintViolation),
    ])('should recognize a unique constraint violation', (error: unknown) => {
        // arrange / act
        const result = isUniqueConstraintViolation(error);

        // assert
        expect(result).toBe(true);
    });

    it.each([
        { code: 'P2025' },
        new RepositoryError('Prisma Client Unknown Request Error', 'R_UNKNOWN'),
        new Error('duplicate key value violates unique constraint'),
    ])('should not mistake another failure for a unique constraint violation', (error: unknown) => {
        // arrange / act
        const result = isUniqueConstraintViolation(error);

        // assert
        expect(result).toBe(false);
    });
});

// #endregion
