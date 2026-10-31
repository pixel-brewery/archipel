// #region Imports

import { QueueError } from './QueueError.js';

// #endregion

/**
 * Thrown when a queue operation receives invalid input.
 *
 * Common triggers include an empty or whitespace-only queue name,
 * or an empty error message passed to {@link IQueue.markFailed}.
 *
 * @public
 */
export class QueueValidationError extends QueueError {
    // #region Ctor

    /**
     * Creates a new {@link QueueValidationError}.
     *
     * @param message - A human-readable description of the validation failure.
     */
    public constructor(message: string) {
        super(message);
        this.name = 'QueueValidationError';
    }

    // #endregion
}
