// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when email-based multi-factor authentication has no email address to send codes to.
 *
 * @remarks
 * `EmailOtpMfaChannel` throws it when neither the setup context nor the
 * person provides an email address. It answers `400 Bad Request` with the
 * stable code `MFA_EMAIL_REQUIRED`.
 *
 * @public
 */
export class MfaEmailRequiredError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_EMAIL_REQUIRED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Email Required',
            detail: 'Email is required for email MFA',
            code: 'MFA_EMAIL_REQUIRED',
        });

        this.name = 'MfaEmailRequiredError';
        this.message = 'Email is required for email MFA';
    }

    // #endregion
}
