// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when the setup of a multi-factor authentication method is confirmed before it was started.
 *
 * @remarks
 * A channel's `verifySetup` throws it when no pending TOTP secret or setup
 * code exists. The person is already signed in, so it answers
 * `400 Bad Request` with the stable code `MFA_SETUP_NOT_INITIALIZED`.
 *
 * @public
 */
export class MfaSetupNotInitializedError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_SETUP_NOT_INITIALIZED';

    // #endregion

    // #region Ctor

    /**
     * @param methodLabel - The display name of the method, such as `TOTP`, `Email`, `SMS`, or `Push`.
     */
    public constructor(methodLabel: string) {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Setup Not Initialized',
            detail: `${methodLabel} setup not initialized`,
            code: 'MFA_SETUP_NOT_INITIALIZED',
        });

        this.name = 'MfaSetupNotInitializedError';
        this.message = `${methodLabel} setup not initialized`;
    }

    // #endregion
}
