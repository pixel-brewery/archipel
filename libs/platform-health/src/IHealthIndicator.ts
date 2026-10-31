// #region Imports

import { HealthIndicatorResult } from '@nestjs/terminus';

// #endregion

/**
 * Defines the contract for a health indicator that can be orchestrated.
 *
 * @public
 */
export interface IHealthIndicator {
    /** Unique key identifying the indicator */
    readonly key: string;

    /** Performs the health check and returns a result keyed by the indicator key */
    check(): Promise<HealthIndicatorResult<string>> | HealthIndicatorResult<string>;
}
