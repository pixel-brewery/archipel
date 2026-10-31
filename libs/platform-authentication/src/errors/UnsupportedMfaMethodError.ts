// #region Imports

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import { HttpStatus } from '@nestjs/common';

// #endregion

/**
 * Error thrown when no channel is registered for a multi-factor authentication method.
 *
 * @remarks
 * `MfaService` throws it for a method name without a registered `IMfaChannel`.
 * It answers `400 Bad Request` with the stable code `UNSUPPORTED_MFA_METHOD`.
 *
 * @public
 */
export class UnsupportedMfaMethodError extends ProblemDetailException {
    // #region Fields

    /** Stable machine-readable error code. */
    public readonly code = 'UNSUPPORTED_MFA_METHOD';

    // #endregion

    // #region Ctor

    /**
     * @param method - The requested method name.
     */
    public constructor(method: string) {
        super(HttpStatus.BAD_REQUEST, {
            title: 'Unsupported MFA Method',
            detail: `Unsupported MFA method: ${method}`,
            code: 'UNSUPPORTED_MFA_METHOD',
        });

        this.name = 'UnsupportedMfaMethodError';
        this.message = `Unsupported MFA method: ${method}`;
    }

    // #endregion
}
