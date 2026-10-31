// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a new multi-factor authentication code is requested before the resend interval has passed.
 *
 * @remarks
 * The email, SMS, and push channels throw it from `initSetup` and
 * `issueChallenge` while the previous code or approval request is too recent.
 * It answers `400 Bad Request` with the stable code `MFA_CODE_RECENTLY_SENT`.
 *
 * @public
 */
export class MfaCodeRecentlySentError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_CODE_RECENTLY_SENT';

    // #endregion

    // #region Ctor

    /**
     * @param codeLabel - The name of what was sent, such as `OTP` or `Approval request`.
     */
    public constructor(codeLabel: string) {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Code Recently Sent',
            detail: `${codeLabel} recently sent. Please wait before requesting another code.`,
            code: 'MFA_CODE_RECENTLY_SENT',
        });

        this.name = 'MfaCodeRecentlySentError';
        this.message = `${codeLabel} recently sent. Please wait before requesting another code.`;
    }

    // #endregion
}
