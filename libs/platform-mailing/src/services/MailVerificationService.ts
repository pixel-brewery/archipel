// #region Imports

import { Injectable } from '@nestjs/common';
import { SmtpConnectionVerifier } from './SmtpConnectionVerifier.js';

// #endregion

/**
 * @deprecated Use {@link SmtpConnectionVerifier} instead. This class will be
 * removed in a future major release.
 *
 * @public
 */
@Injectable()
export class MailVerificationService extends SmtpConnectionVerifier {
    // #region Methods

    /**
     * Verifies SMTP server connectivity.
     *
     * @deprecated Use {@link SmtpConnectionVerifier.verifyConnection} instead.
     * The `email` parameter was never used.
     *
     * @public
     * @param _email - Unused. Kept for backward compatibility.
     */
    public async verifyEmail(_email: string): Promise<boolean> {
        return this.verifyConnection();
    }

    // #endregion
}
