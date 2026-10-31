// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a code does not confirm the setup of a multi-factor authentication method.
 *
 * @remarks
 * `MfaService.verifySetup` throws it for a non-matching code. The person is
 * already signed in, so the rejection answers `400 Bad Request` with the
 * stable code `INVALID_MFA_CODE` rather than `401 Unauthorized`, which a
 * client would read as an ended session.
 *
 * @public
 */
export class InvalidMfaCodeError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'INVALID_MFA_CODE';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'Invalid MFA Code',
            detail: 'The multi-factor authentication code is invalid.',
            code: 'INVALID_MFA_CODE',
        });

        this.name = 'InvalidMfaCodeError';
        this.message = 'The multi-factor authentication code is invalid.';
    }

    // #endregion
}
