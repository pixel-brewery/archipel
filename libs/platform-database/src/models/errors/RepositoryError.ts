// #region Imports

import { type RepositoryErrorKind } from './RepositoryErrorKind.js';
import { RepositoryErrorKinds } from './RepositoryErrorKinds.js';

// #endregion

/**
 * Error thrown when a repository operation fails.
 *
 * @remarks
 * `RepositoryBase` wraps every failed Prisma request in this error and
 * classifies it through {@link RepositoryError.kind}. Inside a query callback
 * the raw Prisma error is still visible; `isUniqueConstraintViolation` and
 * `isRecordNotFound` recognize both forms.
 *
 * @public
 */
export class RepositoryError extends Error {
    public constructor(message: string, originalCode?: string, meta?: Record<string, unknown>, kind: RepositoryErrorKind = RepositoryErrorKinds.Unclassified) {
        super(message);

        Object.setPrototypeOf(this, RepositoryError.prototype);

        this.name = 'RepositoryError';
        this.originalCode = originalCode;
        this.meta = meta;
        this.kind = kind;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RepositoryError);
        }
    }

    public readonly code = 'REPOSITORY_ERROR';
    public readonly originalCode?: string;
    public readonly meta?: Record<string, unknown>;

    /** Why the operation failed, independent of the database driver. */
    public readonly kind: RepositoryErrorKind;
}
