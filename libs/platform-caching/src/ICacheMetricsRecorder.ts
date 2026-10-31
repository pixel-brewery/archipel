/**
 * Metrics recorder for cache operations. Implementations can forward
 * measurements to Prometheus, OpenTelemetry, or any other backend.
 *
 * @public
 */
export interface ICacheMetricsRecorder {
    // #region Methods

    /**
     * Records a cache hit.
     *
     * @public
     * @param cache - The cache name / label.
     */
    recordHit(cache: string): void;

    /**
     * Records a cache miss.
     *
     * @public
     * @param cache - The cache name / label.
     */
    recordMiss(cache: string): void;

    /**
     * Records a successful cache load.
     *
     * @public
     * @param cache - The cache name / label.
     */
    recordLoadSuccess(cache: string): void;

    /**
     * Records a failed cache load.
     *
     * @public
     * @param cache - The cache name / label.
     */
    recordLoadError(cache: string): void;

    /**
     * Records a cache eviction.
     *
     * @public
     * @param cache - The cache name / label.
     */
    recordEviction?(cache: string): void;

    // #endregion
}
