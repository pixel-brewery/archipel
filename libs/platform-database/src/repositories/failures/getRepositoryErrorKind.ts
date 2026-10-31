// #region Imports

import { RepositoryError } from '../../models/errors/RepositoryError.js';
import { type RepositoryErrorKind } from '../../models/errors/RepositoryErrorKind.js';
import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { readPrismaErrorCode } from './prismaFailure.js';

// #endregion

// #region Fields

const PRISMA_ERROR_KINDS: ReadonlyMap<string, RepositoryErrorKind> = new Map<string, RepositoryErrorKind>([
    ['P2002', RepositoryErrorKinds.UniqueConstraintViolation],
    ['P2025', RepositoryErrorKinds.RecordNotFound],
]);

// #endregion

// #region Methods

/**
 * Classifies a failed repository operation.
 *
 * @remarks
 * Recognizes both forms a database failure takes: a {@link RepositoryError}
 * after `repository.execute(query)` and the raw Prisma request error inside
 * a query callback.
 *
 * @param error - The thrown value.
 * @returns The kind, or `undefined` when the value is no repository failure.
 * @internal
 */
export function getRepositoryErrorKind(error: unknown): RepositoryErrorKind | undefined {
    if (error instanceof RepositoryError) {
        return error.kind;
    }

    const code = readPrismaErrorCode(error);

    return code === undefined ? undefined : (PRISMA_ERROR_KINDS.get(code) ?? RepositoryErrorKinds.Unclassified);
}

// #endregion
