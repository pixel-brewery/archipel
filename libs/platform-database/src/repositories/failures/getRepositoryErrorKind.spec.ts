// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { type RepositoryErrorKind } from '../../models/errors/RepositoryErrorKind.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { getRepositoryErrorKind } from './getRepositoryErrorKind.js';

// #endregion

// #region Tests

describe('getRepositoryErrorKind', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it.each<[string, RepositoryErrorKind]>([
        ['P2002', RepositoryErrorKinds.UniqueConstraintViolation],
        ['P2025', RepositoryErrorKinds.RecordNotFound],
        ['P2003', RepositoryErrorKinds.Unclassified],
    ])('should classify the raw Prisma failure %s inside a query callback', (code: string, expected: RepositoryErrorKind) => {
        // arrange
        const error = Object.assign(new Error('Prisma request failed'), { name: 'PrismaClientKnownRequestError', code, clientVersion: '7.10.0' });

        // act
        const kind = getRepositoryErrorKind(error);

        // assert
        expect(kind).toBe(expected);
    });

    it('should return the classification of a wrapped repository failure', () => {
        // arrange
        const error = new RepositoryError('Prisma Client Known Request Error', 'R_KNOWN', { code: 'P2002' }, RepositoryErrorKinds.UniqueConstraintViolation);

        // act
        const kind = getRepositoryErrorKind(error);

        // assert
        expect(kind).toBe(RepositoryErrorKinds.UniqueConstraintViolation);
    });

    it.each([new Error('socket hang up'), Object.assign(new Error('reset'), { code: 'ECONNRESET' }), { code: 'P2002' }, { code: 42 }, null, 'P2002'])(
        'should not classify %s as a repository failure',
        (value: unknown) => {
            // arrange / act
            const kind = getRepositoryErrorKind(value);

            // assert
            expect(kind).toBeUndefined();
        },
    );
});

// #endregion
