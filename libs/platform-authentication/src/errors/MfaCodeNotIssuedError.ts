// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a sign-in challenge code is verified although none was issued.
 *
 * @remarks
 * The email, SMS, and push channels throw it from `verifyChallenge` when no
 * pending code or approval exists. As a sign-in failure it answers
 * `401 Unauthorized` with the stable code `MFA_CODE_NOT_ISSUED`; the setup
 * reports the same situation as `MfaSetupNotInitializedError`.
 *
 * @public
 */
export class MfaCodeNotIssuedError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_CODE_NOT_ISSUED';

    // #endregion

    // #region Ctor

    /**
     * @param codeLabel - The name of the code, such as `Email code`, `SMS code`, or `Push approval`.
     */
    public constructor(codeLabel: string) {
        super(HttpStatus.UNAUTHORIZED, {
            title: 'MFA Code Not Issued',
            detail: `${codeLabel} not issued`,
            code: 'MFA_CODE_NOT_ISSUED',
        });

        this.name = 'MfaCodeNotIssuedError';
        this.message = `${codeLabel} not issued`;
    }

    // #endregion
}
