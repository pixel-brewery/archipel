// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

// #endregion

/**
 * Health indicator for the authentication infrastructure.
 *
 * @public
 */
@Injectable()
export class AuthenticationHealthIndicator implements IHealthIndicator {
    // #region Properties

    public readonly key: string = 'authentication';

    // #endregion

    // #region Methods

    /**
     * Returns the health status of the authentication infrastructure.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): HealthIndicatorResult<string> {
        return {
            [this.key]: {
                status: 'up',
            },
        };
    }

    // #endregion
}
