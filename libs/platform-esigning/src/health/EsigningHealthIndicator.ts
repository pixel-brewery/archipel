// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { EsigningClientBase } from '../abstracts/EsigningClientBase.js';

// #endregion

/**
 * Health indicator for the e-signing infrastructure.
 * Calls {@link EsigningClientBase.ping} to verify provider connectivity.
 *
 * @public
 */
@Injectable()
export class EsigningHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _logger = new Logger(EsigningHealthIndicator.name);
    private readonly _esigningClient?: EsigningClientBase;

    // #endregion

    // #region Ctor

    public constructor(@Optional() esigningClient?: EsigningClientBase) {
        this._esigningClient = esigningClient;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'esigning';

    // #endregion

    // #region Methods

    /**
     * Pings the e-signing provider to verify connectivity.
     * Returns disabled status when no client is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public async check(): Promise<HealthIndicatorResult<string>> {
        if (!this._esigningClient) {
            return {
                esigning: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        try {
            const reachable = await this._esigningClient.ping();

            return {
                esigning: {
                    status: reachable ? 'up' : 'down',
                    provider: this._esigningClient.providerId,
                },
            };
        } catch (error: unknown) {
            this._logger.warn('E-signing provider ping failed.', (error as Error).message);

            return {
                esigning: {
                    status: 'down',
                    provider: this._esigningClient.providerId,
                    error: (error as Error).message,
                },
            };
        }
    }

    // #endregion
}
