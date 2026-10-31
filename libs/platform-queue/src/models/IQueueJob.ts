// #region Types

/**
 * Possible statuses of a queue job.
 *
 * Use as a const object and derive the union type via {@link QueueJobStatus}.
 *
 * @public
 */
export const QUEUE_JOB_STATUS = {
    /** Job is waiting to be picked up. */
    pending: 'pending',
    /** Job has been dequeued and is being processed. */
    processing: 'processing',
    /** Job finished successfully. */
    completed: 'completed',
    /** Job finished with an error. */
    failed: 'failed',
} as const;

/**
 * Union type derived from {@link QUEUE_JOB_STATUS}.
 *
 * @public
 */
export type QueueJobStatus = (typeof QUEUE_JOB_STATUS)[keyof typeof QUEUE_JOB_STATUS];

/**
 * Represents a job in a named queue with tracking metadata.
 *
 * All queue implementations return objects conforming to this interface,
 * making it the unified exchange type between producers and consumers.
 *
 * @typeParam TPayload - The type of the job payload. Defaults to `unknown`.
 * @public
 */
export interface IQueueJob<TPayload = unknown> {
    /** Unique job identifier. */
    readonly id: string;

    /** Name of the queue this job belongs to. */
    readonly queueName: string;

    /** The job payload. */
    readonly payload: TPayload;

    /** Current status of the job. */
    readonly status: QueueJobStatus;

    /** Number of processing attempts. */
    readonly attempts: number;

    /** Timestamp when the job was created. */
    readonly createdAt: Date;

    /** Timestamp when the job was last picked up for processing. */
    readonly startedAt: Date | null;

    /** Timestamp when the job completed successfully. */
    readonly completedAt: Date | null;

    /** Timestamp when the job last failed. */
    readonly failedAt: Date | null;

    /** Error message from the last failure, if any. */
    readonly errorMessage: string | null;
}

// #endregion
