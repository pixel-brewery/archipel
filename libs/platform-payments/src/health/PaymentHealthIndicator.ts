// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PaymentClientBase } from '../abstracts/PaymentClientBase.js';

// #endregion

/**
 * Health indicator for the payment infrastructure.
 * Calls {@link PaymentClientBase.ping} to verify provider connectivity.
 *
 * @public
 */
@Injectable()
export class PaymentHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _logger = new Logger(PaymentHealthIndicator.name);
    private readonly _paymentClient?: PaymentClientBase;

    // #endregion

    // #region Ctor

    public constructor(@Optional() paymentClient?: PaymentClientBase) {
        this._paymentClient = paymentClient;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'payment';

    // #endregion

    // #region Methods

    /**
     * Pings the payment provider to verify connectivity.
     * Returns disabled status when no client is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public async check(): Promise<HealthIndicatorResult<string>> {
        if (!this._paymentClient) {
            return {
                payment: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        try {
            const reachable = await this._paymentClient.ping();

            return {
                payment: {
                    status: reachable ? 'up' : 'down',
                },
            };
        } catch (error: unknown) {
            this._logger.warn('Payment provider ping failed.', (error as Error).message);

            return {
                payment: {
                    status: 'down',
                    error: (error as Error).message,
                },
            };
        }
    }

    // #endregion
}
