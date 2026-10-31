// #region Imports

import { ICacheMetricsRecorder } from '../../ICacheMetricsRecorder.js';

// #endregion

/**
 * No-op implementation of {@link ICacheMetricsRecorder} used as the default
 * when no external metrics backend is configured.
 *
 * @public
 */
export class NoopCacheMetricsRecorder implements ICacheMetricsRecorder {
    // #region Methods

    /** @inheritdoc */
    public recordHit(_cache: string): void {
        // No-op
    }

    /** @inheritdoc */
    public recordMiss(_cache: string): void {
        // No-op
    }

    /** @inheritdoc */
    public recordLoadSuccess(_cache: string): void {
        // No-op
    }

    /** @inheritdoc */
    public recordLoadError(_cache: string): void {
        // No-op
    }

    /** @inheritdoc */
    public recordEviction?(_cache: string): void {
        // No-op
    }

    // #endregion
}
