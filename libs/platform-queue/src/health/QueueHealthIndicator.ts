// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';

// #endregion

/**
 * Health indicator for the queue infrastructure.
 *
 * @public
 */
@Injectable()
export class QueueHealthIndicator implements IHealthIndicator {
    // #region Properties

    public readonly key: string = 'queue';

    // #endregion

    // #region Methods

    /**
     * Returns the health status of the queue infrastructure.
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
