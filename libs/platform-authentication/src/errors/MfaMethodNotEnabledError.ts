// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when a multi-factor authentication method that is not enabled is chosen as the preferred method.
 *
 * @remarks
 * `MfaService.setPreferredMethod` throws it for a method the person has not
 * enabled. It answers `400 Bad Request` with the stable code
 * `MFA_METHOD_NOT_ENABLED`.
 *
 * @public
 */
export class MfaMethodNotEnabledError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'MFA_METHOD_NOT_ENABLED';

    // #endregion

    // #region Ctor

    public constructor() {
        super(HttpStatus.BAD_REQUEST, {
            title: 'MFA Method Not Enabled',
            detail: 'Preferred method must be enabled',
            code: 'MFA_METHOD_NOT_ENABLED',
        });

        this.name = 'MfaMethodNotEnabledError';
        this.message = 'Preferred method must be enabled';
    }

    // #endregion
}
