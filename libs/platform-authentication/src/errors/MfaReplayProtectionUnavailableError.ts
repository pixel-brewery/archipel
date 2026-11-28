// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/** Fails closed when replay protection is configured but the OTP provider cannot expose its verified counter. */
export class MfaReplayProtectionUnavailableError extends ProblemDetailException {
    // #region Fields
    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.SERVICE_UNAVAILABLE, {
            title: 'MFA Replay Protection Unavailable',
            detail: 'The configured OTP provider does not support replay-protected verification.',
            code: 'MFA_REPLAY_PROTECTION_UNAVAILABLE',
        });
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
