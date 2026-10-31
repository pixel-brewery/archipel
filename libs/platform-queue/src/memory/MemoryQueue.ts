// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueJobStateError } from '../errors/QueueJobStateError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { IQueue } from '../interfaces/IQueue.js';
import { IQueueJob, QUEUE_JOB_STATUS } from '../models/IQueueJob.js';

// #endregion

/**
 * Configuration options for {@link MemoryQueue}.
 *
 * @public
 */
export interface IMemoryQueueOptions {
    // #region Properties

    /**
     * Maximum number of jobs retained across all queues.
     *
     * When the limit is exceeded, the oldest completed or failed jobs
     * are evicted first. Defaults to `10_000`.
     *
     * @defaultValue 10_000
     * @public
     */
    maxJobs?: number;

    // #endregion
}

/**
 * In-memory FIFO queue implementation.
 *
 * Stores all jobs in process memory. Suitable for development, testing,
 * and lightweight single-instance workloads. Data is lost on process restart.
 *
 * @remarks
 * Jobs are organized per named queue. Capacity enforcement evicts the oldest
 * completed or failed jobs when {@link IMemoryQueueOptions.maxJobs} is reached.
 *
 * @public
 */
@Injectable()
export class MemoryQueue implements IQueue {
    // #region Fields

    private readonly _logger: Logger = new Logger(MemoryQueue.name);
    private readonly _jobs: Map<string, IQueueJob> = new Map();
    private readonly _queueOrder: Map<string, string[]> = new Map();
    private readonly _maxJobs: number;
    private _nextId = 1;

    // #endregion

    // #region Ctor

    /**
     * Creates a new {@link MemoryQueue} instance.
     *
     * @param options - Optional configuration. See {@link IMemoryQueueOptions}.
     */
    public constructor(options?: IMemoryQueueOptions) {
        this._maxJobs = options?.maxJobs ?? 10_000;
    }

    // #endregion

    // #region Methods

    /** {@inheritDoc IQueue.enqueue} */
    public async enqueue<T = unknown>(queueName: string, payload: T): Promise<IQueueJob<T>> {
        const normalizedName = this.normalizeQueueName(queueName);

        this.enforceCapacity();

        const jobId = `${normalizedName}-${this._nextId++}`;
        const job: IQueueJob<T> = {
            id: jobId,
            queueName: normalizedName,
            payload,
            status: QUEUE_JOB_STATUS.pending,
            attempts: 0,
            createdAt: new Date(),
            startedAt: null,
            completedAt: null,
            failedAt: null,
            errorMessage: null,
        };

        this._jobs.set(job.id, job);
        const queue = this.getOrCreateQueue(normalizedName);
        queue.push(job.id);

        this._logger.debug(`Enqueued job '${job.id}' into queue '${normalizedName}'.`);

        return job;
    }

    /** {@inheritDoc IQueue.dequeue} */
    public async dequeue(queueName: string): Promise<IQueueJob | null> {
        const normalizedName = this.normalizeQueueName(queueName);
        const queue = this._queueOrder.get(normalizedName);

        if (!queue) {
            return null;
        }

        for (const jobId of queue) {
            const job = this._jobs.get(jobId);

            if (!job || job.status !== QUEUE_JOB_STATUS.pending) {
                continue;
            }

            const updatedJob: IQueueJob = {
                ...job,
                status: QUEUE_JOB_STATUS.processing,
                attempts: job.attempts + 1,
                startedAt: new Date(),
                failedAt: null,
                errorMessage: null,
            };

            this._jobs.set(updatedJob.id, updatedJob);

            this._logger.debug(`Dequeued job '${updatedJob.id}' from queue '${normalizedName}'.`);

            return updatedJob;
        }

        return null;
    }

    /** {@inheritDoc IQueue.markCompleted} */
    public async markCompleted(jobId: string): Promise<IQueueJob> {
        const job = this.getRequiredJob(jobId);

        if (job.status !== QUEUE_JOB_STATUS.processing) {
            throw new QueueJobStateError(jobId, QUEUE_JOB_STATUS.processing, job.status);
        }

        const updatedJob: IQueueJob = {
            ...job,
            status: QUEUE_JOB_STATUS.completed,
            completedAt: new Date(),
            errorMessage: null,
        };

        this._jobs.set(updatedJob.id, updatedJob);

        this._logger.debug(`Completed job '${updatedJob.id}'.`);

        return updatedJob;
    }

    /** {@inheritDoc IQueue.markFailed} */
    public async markFailed(jobId: string, errorMessage: string): Promise<IQueueJob> {
        const job = this.getRequiredJob(jobId);

        if (job.status !== QUEUE_JOB_STATUS.processing) {
            throw new QueueJobStateError(jobId, QUEUE_JOB_STATUS.processing, job.status);
        }

        const normalizedMessage = errorMessage.trim();

        if (normalizedMessage.length === 0) {
            throw new QueueValidationError('Queue job error message must not be empty.');
        }

        const updatedJob: IQueueJob = {
            ...job,
            status: QUEUE_JOB_STATUS.failed,
            failedAt: new Date(),
            errorMessage: normalizedMessage,
        };

        this._jobs.set(updatedJob.id, updatedJob);

        this._logger.debug(`Failed job '${updatedJob.id}': ${normalizedMessage}`);

        return updatedJob;
    }

    /** {@inheritDoc IQueue.getJobs} */
    public async getJobs(queueName: string): Promise<ReadonlyArray<IQueueJob>> {
        const normalizedName = this.normalizeQueueName(queueName);
        const queue = this._queueOrder.get(normalizedName) ?? [];

        return queue.map((jobId: string) => this._jobs.get(jobId)).filter((job: IQueueJob | undefined): job is IQueueJob => Boolean(job));
    }

    // #endregion

    // #region Properties

    /**
     * Retrieves or initialises the internal job-ID array for a queue.
     *
     * @param queueName - Normalised queue name.
     * @returns The mutable array of job IDs for the queue.
     */
    private getOrCreateQueue(queueName: string): string[] {
        const existingQueue = this._queueOrder.get(queueName);

        if (existingQueue) {
            return existingQueue;
        }

        const newQueue: string[] = [];
        this._queueOrder.set(queueName, newQueue);

        return newQueue;
    }

    /**
     * Retrieves a job by ID or throws {@link QueueJobNotFoundError}.
     *
     * @param jobId - The job identifier to look up.
     * @returns The matching queue job.
     * @throws {@link QueueJobNotFoundError} When no job with the given ID exists.
     */
    private getRequiredJob(jobId: string): IQueueJob {
        const job = this._jobs.get(jobId);

        if (!job) {
            throw new QueueJobNotFoundError(jobId);
        }

        return job;
    }

    /**
     * Trims and validates a queue name.
     *
     * @param queueName - The raw queue name from the caller.
     * @returns The trimmed queue name.
     * @throws {@link QueueValidationError} When the name is empty or whitespace-only.
     */
    private normalizeQueueName(queueName: string): string {
        const normalizedName = queueName.trim();

        if (normalizedName.length === 0) {
            throw new QueueValidationError('Queue name must not be empty.');
        }

        return normalizedName;
    }

    /**
     * Evicts the oldest completed or failed jobs when the capacity limit is reached.
     */
    private enforceCapacity(): void {
        if (this._jobs.size < this._maxJobs) {
            return;
        }

        // Evict oldest completed/failed jobs first
        for (const [id, job] of this._jobs) {
            if (job.status === QUEUE_JOB_STATUS.completed || job.status === QUEUE_JOB_STATUS.failed) {
                this._jobs.delete(id);
                this.removeFromQueue(job.queueName, id);
                this._logger.debug(`Evicted finished job '${id}' to enforce capacity.`);

                if (this._jobs.size < this._maxJobs) {
                    return;
                }
            }
        }
    }

    /**
     * Removes a job ID from a queue's internal ordering array.
     *
     * @param queueName - The name of the queue.
     * @param jobId     - The job identifier to remove.
     */
    private removeFromQueue(queueName: string, jobId: string): void {
        const queue = this._queueOrder.get(queueName);

        if (!queue) {
            return;
        }

        const index = queue.indexOf(jobId);

        if (index !== -1) {
            queue.splice(index, 1);
        }
    }

    // #endregion
}
