// #region Imports

import { IQueueJob } from '../models/IQueueJob.js';

// #endregion

/**
 * Contract for queue implementations.
 *
 * Provides FIFO job enqueue/dequeue, status transitions, and listing.
 * Implementations may be in-memory, Redis-backed, or cloud-service-backed.
 *
 * @remarks
 * All methods are asynchronous and return {@link IQueueJob} instances.
 * Errors are signalled via domain-specific exceptions:
 * - {@link QueueValidationError} for invalid input.
 * - {@link QueueJobNotFoundError} when a job ID cannot be resolved.
 * - {@link QueueJobStateError} when a job is in the wrong state for a transition.
 *
 * @typeParam TPayload - The default payload type for jobs in this queue. Defaults to `unknown`.
 * @public
 */
export interface IQueue<TPayload = unknown> {
    // #region Methods

    /**
     * Enqueues a new job into the named queue.
     *
     * @public
     * @param queueName - The name of the target queue.
     * @param payload - The job payload.
     * @returns The created job in `pending` status.
     */
    enqueue<T = TPayload>(queueName: string, payload: T): Promise<IQueueJob<T>>;

    /**
     * Dequeues the next pending job from the named queue.
     *
     * The returned job transitions to `processing` status.
     *
     * @public
     * @param queueName - The name of the queue to dequeue from.
     * @returns The next pending job, or `null` if the queue is empty.
     */
    dequeue(queueName: string): Promise<IQueueJob | null>;

    /**
     * Marks a processing job as completed.
     *
     * @public
     * @param jobId - The ID of the job to complete.
     * @returns The updated job in `completed` status.
     * @throws {@link QueueJobNotFoundError} When no job with the given ID exists.
     * @throws {@link QueueJobStateError} When the job is not in `processing` status.
     */
    markCompleted(jobId: string): Promise<IQueueJob>;

    /**
     * Marks a processing job as failed.
     *
     * @public
     * @param jobId - The ID of the job to mark as failed.
     * @param errorMessage - A human-readable error message.
     * @returns The updated job in `failed` status.
     * @throws {@link QueueJobNotFoundError} When no job with the given ID exists.
     * @throws {@link QueueJobStateError} When the job is not in `processing` status.
     */
    markFailed(jobId: string, errorMessage: string): Promise<IQueueJob>;

    /**
     * Returns all jobs for the given queue in insertion order.
     *
     * @public
     * @param queueName - The name of the queue.
     * @returns An array of jobs, possibly empty.
     */
    getJobs(queueName: string): Promise<ReadonlyArray<IQueueJob>>;

    // #endregion
}
