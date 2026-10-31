import { Injectable, Logger } from '@nestjs/common';
import type { OnApplicationShutdown } from '@nestjs/common';
import type { IOtelSdk } from './interfaces/IOtelSdk.js';

const defaultLifecycleTimeoutMillis = 5_000;

/**
 * Holds a reference to the selected OpenTelemetry SDK components and
 * performs a graceful shutdown when the application terminates.
 *
 * Replaces the former closure-based `otelSdkRef` pattern (TEL-1).
 *
 * @public
 */
@Injectable()
export class OtelSdkHolder implements OnApplicationShutdown {
    // #region Fields

    private readonly _logger = new Logger(OtelSdkHolder.name);
    private _sdk?: Pick<IOtelSdk, 'shutdown'> & Partial<Pick<IOtelSdk, 'forceFlush'>>;
    private _shutdown?: Promise<void>;

    // #endregion

    // #region Properties

    /**
     * Whether the OpenTelemetry SDK has been initialized.
     *
     * @public
     */
    public get isInitialized(): boolean {
        return this._sdk !== undefined;
    }

    // #endregion

    // #region Methods

    /**
     * Stores the SDK reference so it can be shut down later.
     * Can only be called once - subsequent calls are ignored.
     */
    public setSdk(sdk: Pick<IOtelSdk, 'shutdown'> & Partial<Pick<IOtelSdk, 'forceFlush'>>): void {
        if (this._sdk) {
            this._logger.warn('OtelSdkHolder.setSdk() called more than once - ignoring.');
            return;
        }
        this._sdk = sdk;
    }

    /**
     * Flushes pending telemetry without stopping a warm application instance.
     * Hosts may retain this Promise through their serverless completion mechanism.
     * Optional telemetry failures are diagnosed and do not reject the host request.
     */
    public async forceFlush(timeoutMillis = defaultLifecycleTimeoutMillis): Promise<void> {
        const sdk = this._sdk;
        if (!sdk?.forceFlush || this._shutdown) return;

        try {
            await this.runBounded(() => sdk.forceFlush?.(timeoutMillis) ?? Promise.resolve(), timeoutMillis);
        } catch (error: unknown) {
            this._logger.error('Failed to flush OpenTelemetry SDK.', (error as Error).stack);
        }
    }

    /** @inheritdoc */
    public onApplicationShutdown(): Promise<void> {
        const sdk = this._sdk;
        if (!sdk) return Promise.resolve();
        this._shutdown ??= this.shutdown(sdk);
        return this._shutdown;
    }

    private async shutdown(sdk: Pick<IOtelSdk, 'shutdown'>): Promise<void> {
        try {
            await this.runBounded(() => sdk.shutdown(), defaultLifecycleTimeoutMillis);
            this._logger.log('OpenTelemetry SDK shut down successfully.');
        } catch (error: unknown) {
            this._logger.error('Failed to shut down OpenTelemetry SDK.', (error as Error).stack);
        }
    }

    private async runBounded(operation: () => Promise<void>, timeoutMillis: number): Promise<void> {
        if (!Number.isFinite(timeoutMillis) || timeoutMillis <= 0 || timeoutMillis > 2_147_483_647) {
            throw new RangeError('OpenTelemetry lifecycle timeout must be a positive finite number of milliseconds.');
        }
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            await Promise.race([
                Promise.resolve().then(operation),
                new Promise<never>((_resolve, reject) => {
                    timer = setTimeout(() => reject(new Error(`OpenTelemetry lifecycle operation exceeded ${timeoutMillis}ms.`)), timeoutMillis);
                }),
            ]);
        } finally {
            if (timer !== undefined) clearTimeout(timer);
        }
    }

    // #endregion
}
