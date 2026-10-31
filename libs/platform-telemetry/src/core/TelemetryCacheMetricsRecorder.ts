// #region Imports
import { ICacheMetricsRecorder } from '@pixel-brewery/archipel-platform-caching';
import { Inject, Injectable } from '@nestjs/common';
import { TELEMETRY_FACADE } from '../tokens/TelemetryTokens.js';
import { ITelemetryFacade } from './NoopTelemetryFacade.js';
// #endregion

/**
 * Generic cache metrics recorder that forwards cache lifecycle events
 * into the telemetry facade (which may be a noop when disabled).
 *
 * @public
 */
@Injectable()
export class TelemetryCacheMetricsRecorder implements ICacheMetricsRecorder {
    // #region Fields
    private readonly _telemetry: ITelemetryFacade;
    // #endregion

    // #region Ctor
    public constructor(@Inject(TELEMETRY_FACADE) telemetry: ITelemetryFacade) {
        this._telemetry = telemetry;
    }
    // #endregion

    // #region Methods
    public recordHit(cache: string): void {
        this._telemetry.recordCacheEvent?.({
            cache,
            outcome: 'hit',
        });
    }
    public recordMiss(cache: string): void {
        this._telemetry.recordCacheEvent?.({
            cache,
            outcome: 'miss',
        });
    }
    public recordLoadSuccess(cache: string): void {
        this._telemetry.recordCacheEvent?.({
            cache,
            outcome: 'load_success',
            phase: 'load',
        });
    }
    public recordLoadError(cache: string): void {
        this._telemetry.recordCacheEvent?.({
            cache,
            outcome: 'load_error',
            phase: 'load',
        });
    }
    public recordEviction(cache: string): void {
        this._telemetry.recordCacheEvent?.({
            cache,
            outcome: 'eviction',
            phase: 'evict',
        });
    }
    // #endregion
}
