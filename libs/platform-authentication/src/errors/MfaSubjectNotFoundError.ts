// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when the `MfaSubjectBase` does not find the person of a multi-factor authentication operation.
 *
 * @remarks
 * Every `MfaService` and channel operation that reads the multi-factor
 * authentication state of a person throws it when that person does not
 * exist. It answers `400 Bad Request` with the stable code
 * `MFA_SUBJECT_NOT_FOUND`.
 *
 * @public
 */
export class MfaSubjectNotFoundError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_SUBJECT_NOT_FOUND';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Subject Not Found',
            detail: 'User not found',
            code: 'MFA_SUBJECT_NOT_FOUND',
        });

        this.name = 'MfaSubjectNotFoundError';
        this.message = 'User not found';
    }

    // #endregion
}
