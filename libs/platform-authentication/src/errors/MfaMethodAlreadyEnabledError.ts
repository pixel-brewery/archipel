// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when the setup of a multi-factor authentication method starts although the method is already enabled.
 *
 * @remarks
 * `MfaService.initSetup` throws it for a method the person already uses. It
 * answers `400 Bad Request` with the stable code `MFA_METHOD_ALREADY_ENABLED`.
 *
 * @public
 */
export class MfaMethodAlreadyEnabledError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_METHOD_ALREADY_ENABLED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Method Already Enabled',
            detail: 'Selected MFA method is already enabled',
            code: 'MFA_METHOD_ALREADY_ENABLED',
        });

        this.name = 'MfaMethodAlreadyEnabledError';
        this.message = 'Selected MFA method is already enabled';
    }

    // #endregion
}
