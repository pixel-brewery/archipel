// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a sign-in challenge code is verified after it expired.
 *
 * @remarks
 * The email, SMS, and push channels throw it from `verifyChallenge` when the
 * pending code or approval is past its lifetime. As a sign-in failure it
 * answers `401 Unauthorized` with the stable code `MFA_CODE_EXPIRED`; the
 * setup reports the same situation as `MfaSetupExpiredError`.
 *
 * @public
 */
export class MfaCodeExpiredError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_CODE_EXPIRED';

    // #endregion

    // #region Ctor

    /**
     * @param codeLabel - The name of the code, such as `Email code`, `SMS code`, or `Push approval`.
     */
    public constructor(codeLabel: string) {
        super(HttpStatus.UNAUTHORIZED, {
            title: 'MFA Code Expired',
            detail: `${codeLabel} expired`,
            code: 'MFA_CODE_EXPIRED',
        });

        this.name = 'MfaCodeExpiredError';
        this.message = `${codeLabel} expired`;
    }

    // #endregion
}
