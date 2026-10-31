// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

// #endregion

/**
 * Health indicator for the caching layer.
 *
 * @public
 */
@Injectable()
export class CachingHealthIndicator implements IHealthIndicator {
    // #region Properties

    public readonly key: string = 'caching';

    // #endregion

    // #region Methods

    /**
     * Returns the health status of the caching layer.
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
