// #region Imports

import { isRecordNotFound } from './isRecordNotFound.js';

// #endregion

// #region Methods

/**
 * Runs a revision-bound (compare-and-swap) write and reports a changed or
 * removed record as the caller's conflict error.
 *
 * @remarks
 * The write's filter must include the revision the caller observed, such as
 * `updatedAt` or a version number, next to the record key. When the record
 * changed or disappeared after it was read, the `update` or `delete` matches
 * no row and Prisma fails with "record not found" (`P2025`); this helper
 * reports that as the conflict. Every other failure is rethrown unchanged.
 * Do not wrap writes whose filter is not bound to a revision, because a plain
 * missing record would then be misreported as a conflict.
 *
 * @example
 * ```typescript
 * return query<ConnectorDelegate, ConnectorModel>('updateConnector', (model) =>
 *     translateRevisionConflict(
 *         () => model.update({ where: { id, updatedAt: expectedUpdatedAt }, data }),
 *         () => new ConnectorRevisionConflictError(id),
 *     ),
 * );
 * ```
 *
 * @param operation - The write whose filter is bound to the observed revision.
 * @param createError - Creates the conflict error from the failure.
 * @returns The result of the write.
 * @public
 */
export async function translateRevisionConflict<TResult>(operation: () => PromiseLike<TResult>, createError: (failure: unknown) => Error): Promise<TResult> {
    try {
        return await operation();
    } catch (error: unknown) {
        if (isRecordNotFound(error)) {
            throw createError(error);
        }

        throw error;
    }
}

// #endregion
