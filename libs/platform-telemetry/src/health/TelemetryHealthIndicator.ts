// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { OtelSdkHolder } from '../OtelSdkHolder.js';

// #endregion

/**
 * Health indicator for the telemetry infrastructure.
 * Checks whether the OpenTelemetry SDK has been initialized via {@link OtelSdkHolder}.
 *
 * @public
 */
@Injectable()
export class TelemetryHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _sdkHolder?: OtelSdkHolder;

    // #endregion

    // #region Ctor

    public constructor(@Optional() sdkHolder?: OtelSdkHolder) {
        this._sdkHolder = sdkHolder;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'telemetry';

    // #endregion

    // #region Methods

    /**
     * Checks whether the OpenTelemetry SDK has been initialized.
     * Returns disabled status when no SDK holder is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): HealthIndicatorResult<string> {
        if (!this._sdkHolder) {
            return {
                telemetry: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        return {
            telemetry: {
                status: this._sdkHolder.isInitialized ? 'up' : 'down',
                sdkInitialized: this._sdkHolder.isInitialized,
            },
        };
    }

    // #endregion
}
