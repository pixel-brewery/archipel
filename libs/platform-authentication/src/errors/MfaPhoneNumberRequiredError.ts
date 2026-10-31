// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when SMS-based multi-factor authentication has no phone number to send codes to.
 *
 * @remarks
 * `SmsMfaChannel` throws it when neither the setup context nor the person
 * provides a phone number. It answers `400 Bad Request` with the stable code
 * `MFA_PHONE_NUMBER_REQUIRED`.
 *
 * @public
 */
export class MfaPhoneNumberRequiredError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_PHONE_NUMBER_REQUIRED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Phone Number Required',
            detail: 'Phone number is required for SMS MFA',
            code: 'MFA_PHONE_NUMBER_REQUIRED',
        });

        this.name = 'MfaPhoneNumberRequiredError';
        this.message = 'Phone number is required for SMS MFA';
    }

    // #endregion
}
