// #region Imports

import { QueueError } from './QueueError.js';

// #endregion

/**
 * Thrown when a queue job cannot be found by its ID.
 *
 * Typically raised by {@link IQueue.markCompleted} or {@link IQueue.markFailed}
 * when the supplied job identifier does not match any tracked job.
 *
 * @public
 */
export class QueueJobNotFoundError extends QueueError {
    // #region Ctor

    /**
     * Creates a new {@link QueueJobNotFoundError}.
     *
     * @param jobId - The identifier of the job that could not be located.
     */
    public constructor(jobId: string) {
        super(`Queue job '${jobId}' was not found.`);
        this.name = 'QueueJobNotFoundError';
    }

    // #endregion
}
