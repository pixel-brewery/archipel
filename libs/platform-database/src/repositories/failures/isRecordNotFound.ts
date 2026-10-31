// #region Imports

import { RepositoryErrorKinds } from '../../models/errors/RepositoryErrorKinds.js';
import { getRepositoryErrorKind } from './getRepositoryErrorKind.js';

// #endregion

// #region Methods

/**
 * Determines whether a repository operation failed because a required record
 * does not exist or no longer matches the operation's filter.
 *
 * @remarks
 * Recognizes a {@link RepositoryError} after `repository.execute(query)` as
 * well as the raw Prisma `P2025` error inside a query callback. For a
 * revision-bound (compare-and-swap) write, prefer
 * {@link translateRevisionConflict}.
 *
 * @param error - The thrown value.
 * @returns `true` when the required record was not found.
 * @public
 */
export function isRecordNotFound(error: unknown): boolean {
    return getRepositoryErrorKind(error) === RepositoryErrorKinds.RecordNotFound;
}

// #endregion
