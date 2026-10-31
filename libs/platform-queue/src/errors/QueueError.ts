/**
 * Base error class for all queue-related errors.
 *
 * Every domain-specific queue error (validation, not-found, state) extends
 * this class so consumers can catch the entire hierarchy with a single type.
 *
 * @public
 */
export class QueueError extends Error {
    // #region Ctor

    /**
     * Creates a new {@link QueueError}.
     *
     * @param message - A human-readable description of the error.
     */
    public constructor(message: string) {
        super(message);
        this.name = 'QueueError';
    }

    // #endregion
}
