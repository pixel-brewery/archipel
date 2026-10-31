// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { isRecordNotFound } from './isRecordNotFound.js';

// #endregion

// #region Tests

describe('isRecordNotFound', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each([
        Object.assign(new Error('Record to update not found.'), { name: 'PrismaClientKnownRequestError', code: 'P2025', clientVersion: '7.10.0' }),
        new RepositoryError('Prisma Client Known Request Error', 'R_KNOWN', undefined, RepositoryErrorKinds.RecordNotFound),
    ])('should recognize a required record that was not found', (error: unknown) => {
        // arrange / act
        const result = isRecordNotFound(error);

        // assert
        expect(result).toBe(true);
    });

    it.each([{ code: 'P2002' }, new Error('Record to update not found.'), undefined])(
        'should not mistake another failure for a missing record',
        (error: unknown) => {
            // arrange / act
            const result = isRecordNotFound(error);

            // assert
            expect(result).toBe(false);
        },
    );
});

// #endregion
