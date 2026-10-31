/**
 * Cache statistics snapshot returned by cache implementations.
 *
 * @public
 */
export interface ICacheStats {
    // #region Properties

    /**
     * Number of cache hits.
     *
     * @public
     */
    hits: number;

    /**
     * Number of cache misses.
     *
     * @public
     */
    misses: number;

    /**
     * Number of successful cache loads.
     *
     * @public
     */
    loads: number;

    /**
     * Number of failed cache loads.
     *
     * @public
     */
    loadErrors: number;

    /**
     * Number of cache evictions (if supported).
     *
     * @public
     */
    evictions?: number;
}
