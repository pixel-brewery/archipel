/**
 * Result of a windowed counter operation.
 *
 * @public
 */
export interface IWindowedCounterResult {
    /**
     * Count accumulated in the current window, including the increment that produced this result.
     *
     * @public
     */
    readonly value: number;

    /**
     * Moment the current window ends and the count starts over.
     *
     * @public
     */
    readonly resetAt: Date;
}

/**
 * Counts occurrences inside a fixed time window.
 *
 * A rate limit needs a counter that every instance of an application agrees on. Counting in process
 * memory silently multiplies the limit by the number of instances, so the limit that was configured
 * is not the limit that applies. This abstract base hides where the count lives; a shared implementation
 * makes the configured limit the real one, and the in-memory implementation stays correct for a
 * single instance.
 *
 * Windows are fixed and derived from the wall clock: the window an operation falls into is
 * `floor(now / windowMs)`. That needs no coordination between instances, which is what allows the
 * shared implementation to be a single atomic operation.
 *
 * @public
 */
export interface IWindowedCounter {
    /**
     * Adds to the count of the window the current moment falls into.
     *
     * The increment and the expiry are applied as one operation, so two instances incrementing at the
     * same moment produce two distinct values and neither can lose the other's write.
     *
     * @param key - Identifier of the counted subject, for example a tenant and a limit name.
     * @param windowMs - Length of the window in milliseconds.
     * @param amount - Amount to add. Defaults to 1.
     * @public
     */
    increment(key: string, windowMs: number, amount?: number): Promise<IWindowedCounterResult>;

    /**
     * Reads the current window without changing it.
     *
     * @param key - Identifier of the counted subject.
     * @param windowMs - Length of the window in milliseconds.
     * @public
     */
    peek(key: string, windowMs: number): Promise<IWindowedCounterResult>;

    /**
     * Discards the current window of a subject.
     *
     * @param key - Identifier of the counted subject.
     * @param windowMs - Length of the window in milliseconds.
     * @public
     */
    reset(key: string, windowMs: number): Promise<void>;
}
