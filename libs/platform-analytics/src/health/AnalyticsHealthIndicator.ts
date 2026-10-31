// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { AnalyticsClientBase } from '../abstracts/AnalyticsClientBase.js';

// #endregion

/**
 * Health indicator for the analytics infrastructure.
 * Calls {@link AnalyticsClientBase.ping} to verify provider readiness.
 *
 * @public
 */
@Injectable()
export class AnalyticsHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _logger = new Logger(AnalyticsHealthIndicator.name);
    private readonly _analyticsClient?: AnalyticsClientBase;

    // #endregion

    // #region Ctor

    public constructor(@Optional() analyticsClient?: AnalyticsClientBase) {
        this._analyticsClient = analyticsClient;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'analytics';

    // #endregion

    // #region Methods

    /**
     * Pings the analytics provider to verify readiness.
     * Returns disabled status when no client is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public async check(): Promise<HealthIndicatorResult<string>> {
        if (!this._analyticsClient) {
            return {
                analytics: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        try {
            const ready = await this._analyticsClient.ping();

            return {
                analytics: {
                    status: ready ? 'up' : 'down',
                },
            };
        } catch (error: unknown) {
            this._logger.warn('Analytics provider ping failed.', (error as Error).message);

            return {
                analytics: {
                    status: 'down',
                    error: (error as Error).message,
                },
            };
        }
    }

    // #endregion
}
