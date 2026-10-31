// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a multi-factor authentication code is missing.
 *
 * @remarks
 * `MfaService.verifySetup` throws it for an empty or blank code. It answers
 * `400 Bad Request` with the stable code `MFA_CODE_REQUIRED`.
 *
 * @public
 */
export class MfaCodeRequiredError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_CODE_REQUIRED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Code Required',
            detail: 'A verification code is required',
            code: 'MFA_CODE_REQUIRED',
        });

        this.name = 'MfaCodeRequiredError';
        this.message = 'A verification code is required';
    }

    // #endregion
}
