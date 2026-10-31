// #region Imports

import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { getRepositoryErrorKind } from './getRepositoryErrorKind.js';

// #endregion

// #region Methods

/**
 * Determines whether a repository write failed because it violated a unique constraint.
 *
 * @remarks
 * Recognizes a {@link RepositoryError} after `repository.execute(query)` as
 * well as the raw Prisma `P2002` error inside a query callback. To translate
 * the violation of a single write, prefer
 * {@link translateUniqueConstraintViolation}.
 *
 * @param error - The thrown value.
 * @returns `true` for a unique constraint violation.
 * @public
 */
export function isUniqueConstraintViolation(error: unknown): boolean {
    return getRepositoryErrorKind(error) === RepositoryErrorKinds.UniqueConstraintViolation;
}

// #endregion
