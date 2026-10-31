// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when the code or approval that confirms a multi-factor authentication setup has expired.
 *
 * @remarks
 * The email, SMS, and push channels throw it from `verifySetup`. The person is
 * already signed in, so it answers `400 Bad Request` with the stable code
 * `MFA_SETUP_EXPIRED` rather than `401`, which clients read as an ended
 * session; the setup can be started again.
 *
 * @public
 */
export class MfaSetupExpiredError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_SETUP_EXPIRED';

    // #endregion

    // #region Ctor

    /**
     * @param codeLabel - The name of the code, such as `Email code`, `SMS code`, or `Push approval`.
     */
    public constructor(codeLabel: string) {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Setup Expired',
            detail: `${codeLabel} expired`,
            code: 'MFA_SETUP_EXPIRED',
        });

        this.name = 'MfaSetupExpiredError';
        this.message = `${codeLabel} expired`;
    }

    // #endregion
}
