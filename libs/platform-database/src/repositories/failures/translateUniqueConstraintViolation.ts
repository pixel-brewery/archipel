// #region Imports

import { isUniqueConstraintViolation } from './isUniqueConstraintViolation.js';

// #endregion

// #region Methods

/**
 * Runs a write and reports a unique constraint violation as the caller's error.
 *
 * @remarks
 * A pre-check (for example "is the name still free?") cannot rule out a
 * concurrent write that stores the same value first; the unique constraint
 * stays the final guard. Wrap the guarded write so that this race answers with
 * the same caller-defined error as the pre-check instead of an uncoded database
 * failure. Every other failure is rethrown unchanged.
 *
 * @example
 * ```typescript
 * return query<LocationDelegate, LocationModel>('createLocation', (model) =>
 *     translateUniqueConstraintViolation(
 *         () => model.create({ data }),
 *         () => new LocationNameAlreadyExistsError(data.name),
 *     ),
 * );
 * ```
 *
 * @param operation - The write guarded by a unique constraint.
 * @param createError - Creates the caller's error from the violation.
 * @returns The result of the write.
 * @public
 */
export async function translateUniqueConstraintViolation<TResult>(
    operation: () => PromiseLike<TResult>,
    createError: (violation: unknown) => Error,
): Promise<TResult> {
    try {
        return await operation();
    } catch (error: unknown) {
        if (isUniqueConstraintViolation(error)) {
            throw createError(error);
        }

        throw error;
    }
}

// #endregion
