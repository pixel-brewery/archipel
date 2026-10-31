// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when an operation requires multi-factor authentication that the person has not enabled.
 *
 * @remarks
 * `MfaService.verifyChallenge` and `MfaService.regenerateBackupCodes` throw it
 * for a person without enabled multi-factor authentication. It answers
 * `400 Bad Request` with the stable code `MFA_NOT_ENABLED`.
 *
 * @public
 */
export class MfaNotEnabledError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_NOT_ENABLED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Not Enabled',
            detail: 'Multi-factor authentication is not enabled',
            code: 'MFA_NOT_ENABLED',
        });

        this.name = 'MfaNotEnabledError';
        this.message = 'Multi-factor authentication is not enabled';
    }

    // #endregion
}
