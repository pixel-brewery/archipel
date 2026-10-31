// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a sign-in challenge is issued for a multi-factor authentication channel the person has not enabled.
 *
 * @remarks
 * The email, SMS, and push channels throw it from `issueChallenge`. As a
 * sign-in failure it answers `401 Unauthorized` with the stable code
 * `MFA_CHANNEL_NOT_ENABLED`.
 *
 * @public
 */
export class MfaChannelNotEnabledError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_CHANNEL_NOT_ENABLED';

    // #endregion

    // #region Ctor

    /**
     * @param methodLabel - The display name of the method, such as `Email`, `SMS`, or `Push`.
     */
    public constructor(methodLabel: string) {
        super(HttpStatus.UNAUTHORIZED, {
            title: 'MFA Channel Not Enabled',
            detail: `${methodLabel} MFA is not enabled`,
            code: 'MFA_CHANNEL_NOT_ENABLED',
        });

        this.name = 'MfaChannelNotEnabledError';
        this.message = `${methodLabel} MFA is not enabled`;
    }

    // #endregion
}
