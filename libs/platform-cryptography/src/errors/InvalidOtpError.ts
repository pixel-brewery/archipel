// #region Imports

import { CryptographyErrorBase } from './abstracts/CryptographyErrorBase.js';

// #endregion

/**
 * Thrown when an OTP token fails verification.
 *
 * @public
 */
export class InvalidOtpError extends CryptographyErrorBase {
    // #region Ctor

    public constructor(message = 'The provided OTP token is invalid or expired.') {
        super(message, 'INVALID_OTP');
        this.name = 'InvalidOtpError';
    }

    // #endregion
}
