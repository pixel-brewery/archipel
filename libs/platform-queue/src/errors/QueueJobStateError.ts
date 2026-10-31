// #region Imports

import { QueueError } from './QueueError.js';

// #endregion

/**
 * Thrown when a queue job is in an invalid state for the requested transition.
 *
 * For example, calling {@link IQueue.markCompleted} on a job that is still
 * in `pending` status rather than `processing` triggers this error.
 *
 * @public
 */
export class QueueJobStateError extends QueueError {
    // #region Ctor

    /**
     * Creates a new {@link QueueJobStateError}.
     *
     * @param jobId          - The identifier of the affected job.
     * @param expectedStatus - The status required for the attempted transition.
     * @param actualStatus   - The current status of the job.
     */
    public constructor(jobId: string, expectedStatus: string, actualStatus: string) {
        super(`Queue job '${jobId}' is in '${actualStatus}' status, expected '${expectedStatus}'.`);
        this.name = 'QueueJobStateError';
    }

    // #endregion
}
