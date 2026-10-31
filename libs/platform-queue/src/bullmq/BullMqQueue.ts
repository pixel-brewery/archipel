// #region Imports

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Job, Queue, Worker } from 'bullmq';
import { randomUUID } from 'crypto';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueJobStateError } from '../errors/QueueJobStateError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { IQueue } from '../interfaces/IQueue.js';
import { IQueueJob, QUEUE_JOB_STATUS, QueueJobStatus } from '../models/IQueueJob.js';

// #endregion

/**
 * Configuration options for {@link BullMqQueue}.
 *
 * @public
 */
export interface IBullMqQueueOptions {
    // #region Properties

    /**
     * Redis connection URL.
     *
     * @example `redis://localhost:6379`
     * @public
     */
    redisUrl: string;

    /**
     * Optional prefix applied to all BullMQ queue keys in Redis.
     *
     * @defaultValue `''`
     * @public
     */
    prefix?: string;

    // #endregion
}

/**
 * BullMQ-backed queue implementation.
 *
 * Uses Redis via BullMQ for persistent, distributed job processing.
 * Supports FIFO ordering, automatic retries, and horizontal scaling.
 *
 * @remarks
 * Each named queue lazily creates its own BullMQ {@link Queue} and {@link Worker}
 * instance. Job tokens are tracked internally so that {@link markCompleted}
 * and {@link markFailed} can move jobs to the correct terminal state.
 *
 * @public
 */
@Injectable()
export class BullMqQueue implements IQueue, OnModuleDestroy {
    // #region Fields

    private readonly _logger: Logger = new Logger(BullMqQueue.name);
    private readonly _queues: Map<string, Queue> = new Map();
    private readonly _workers: Map<string, Worker> = new Map();
    private readonly _jobTokens: Map<string, { queueName: string; token: string }> = new Map();
    private readonly _redisUrl: string;
    private readonly _prefix: string;

    // #endregion

    // #region Ctor

    /**
     * Creates a new {@link BullMqQueue} instance.
     *
     * @param options - Redis connection and optional prefix. See {@link IBullMqQueueOptions}.
     */
    public constructor(options: IBullMqQueueOptions) {
        this._redisUrl = options.redisUrl;
        this._prefix = options.prefix ?? '';
    }

    // #endregion

    // #region Methods

    /** {@inheritDoc IQueue.enqueue} */
    public async enqueue<T = unknown>(queueName: string, payload: T): Promise<IQueueJob<T>> {
        const normalizedName = this.normalizeQueueName(queueName);
        const queue = this.getOrCreateQueue(normalizedName);

        const job: Job<T> = await queue.add(normalizedName, payload);

        this._logger.debug(`Enqueued job '${job.id}' into queue '${normalizedName}'.`);

        return this.mapToQueueJob<T>(job);
    }

    /** {@inheritDoc IQueue.dequeue} */
    public async dequeue(queueName: string): Promise<IQueueJob | null> {
        const normalizedName = this.normalizeQueueName(queueName);
        const worker = this.getOrCreateWorker(normalizedName);

        const token = randomUUID();
        const job: Job | undefined = await worker.getNextJob(token);

        if (!job) {
            return null;
        }

        this._jobTokens.set(job.id as string, { queueName: normalizedName, token });

        this._logger.debug(`Dequeued job '${job.id}' from queue '${normalizedName}'.`);

        return this.mapToQueueJob(job, QUEUE_JOB_STATUS.processing);
    }

    /** {@inheritDoc IQueue.markCompleted} */
    public async markCompleted(jobId: string): Promise<IQueueJob> {
        const meta = this._jobTokens.get(jobId);

        if (!meta) {
            throw new QueueJobNotFoundError(jobId);
        }

        const queue = this._queues.get(meta.queueName);

        if (!queue) {
            throw new QueueJobNotFoundError(jobId);
        }

        const job: Job | undefined = await queue.getJob(jobId);

        if (!job) {
            throw new QueueJobNotFoundError(jobId);
        }

        const state = await job.getState();

        if (state !== 'active') {
            throw new QueueJobStateError(jobId, QUEUE_JOB_STATUS.processing, this.mapBullMqState(state));
        }

        await job.moveToCompleted('completed', meta.token);
        this._jobTokens.delete(jobId);

        this._logger.debug(`Completed job '${jobId}'.`);

        return this.mapToQueueJob(job, QUEUE_JOB_STATUS.completed);
    }

    /** {@inheritDoc IQueue.markFailed} */
    public async markFailed(jobId: string, errorMessage: string): Promise<IQueueJob> {
        const normalizedMessage = errorMessage.trim();

        if (normalizedMessage.length === 0) {
            throw new QueueValidationError('Queue job error message must not be empty.');
        }

        const meta = this._jobTokens.get(jobId);

        if (!meta) {
            throw new QueueJobNotFoundError(jobId);
        }

        const queue = this._queues.get(meta.queueName);

        if (!queue) {
            throw new QueueJobNotFoundError(jobId);
        }

        const job: Job | undefined = await queue.getJob(jobId);

        if (!job) {
            throw new QueueJobNotFoundError(jobId);
        }

        const state = await job.getState();

        if (state !== 'active') {
            throw new QueueJobStateError(jobId, QUEUE_JOB_STATUS.processing, this.mapBullMqState(state));
        }

        await job.moveToFailed(new Error(normalizedMessage), meta.token);
        this._jobTokens.delete(jobId);

        this._logger.debug(`Failed job '${jobId}': ${normalizedMessage}`);

        return this.mapToQueueJob(job, QUEUE_JOB_STATUS.failed, normalizedMessage);
    }

    /** {@inheritDoc IQueue.getJobs} */
    public async getJobs(queueName: string): Promise<ReadonlyArray<IQueueJob>> {
        const normalizedName = this.normalizeQueueName(queueName);
        const queue = this._queues.get(normalizedName);

        if (!queue) {
            return [];
        }

        const jobs: Job[] = await queue.getJobs(['waiting', 'active', 'completed', 'failed']);

        return jobs.sort((a, b) => a.timestamp - b.timestamp).map((job) => this.mapToQueueJob(job));
    }

    /**
     * Closes all workers and queues, releasing Redis connections.
     *
     * Called automatically by the NestJS lifecycle when the module is destroyed.
     */
    public async onModuleDestroy(): Promise<void> {
        for (const worker of this._workers.values()) {
            await worker.close();
        }

        for (const queue of this._queues.values()) {
            await queue.close();
        }

        this._workers.clear();
        this._queues.clear();
        this._jobTokens.clear();
    }

    /**
     * Retrieves or creates a BullMQ {@link Queue} for the given name.
     *
     * @param queueName - Normalised queue name.
     * @returns The BullMQ queue instance.
     */
    private getOrCreateQueue(queueName: string): Queue {
        const existingQueue = this._queues.get(queueName);

        if (existingQueue) {
            return existingQueue;
        }

        const queue = new Queue(queueName, {
            connection: { url: this._redisUrl },
            prefix: this._prefix || undefined,
        });

        this._queues.set(queueName, queue);

        return queue;
    }

    /**
     * Retrieves or creates a BullMQ {@link Worker} for the given name.
     *
     * @param queueName - Normalised queue name.
     * @returns The BullMQ worker instance.
     */
    private getOrCreateWorker(queueName: string): Worker {
        const existingWorker = this._workers.get(queueName);

        if (existingWorker) {
            return existingWorker;
        }

        const worker = new Worker(queueName, undefined, {
            connection: { url: this._redisUrl },
            prefix: this._prefix || undefined,
        });

        this._workers.set(queueName, worker);

        return worker;
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
     * Maps a BullMQ {@link Job} to the platform {@link IQueueJob} shape.
     *
     * @param job            - The BullMQ job instance.
     * @param statusOverride - Optional explicit status to set.
     * @param errorMessage   - Optional error message for failed jobs.
     * @returns The mapped queue job.
     */
    private mapToQueueJob<T = unknown>(job: Job<T>, statusOverride?: QueueJobStatus, errorMessage?: string): IQueueJob<T> {
        const state = job.returnvalue === 'completed' ? QUEUE_JOB_STATUS.completed : QUEUE_JOB_STATUS.pending;

        return {
            id: job.id as string,
            queueName: job.queueName,
            payload: job.data,
            status: statusOverride ?? state,
            attempts: job.attemptsMade,
            createdAt: new Date(job.timestamp),
            startedAt: job.processedOn ? new Date(job.processedOn) : null,
            completedAt: job.finishedOn ? new Date(job.finishedOn) : null,
            failedAt: job.failedReason ? (job.finishedOn ? new Date(job.finishedOn) : null) : null,
            errorMessage: errorMessage ?? job.failedReason ?? null,
        };
    }

    /**
     * Converts a BullMQ state string to a {@link QueueJobStatus} value.
     *
     * @param state - The BullMQ state string (e.g. `'waiting'`, `'active'`, `'completed'`).
     * @returns The corresponding {@link QueueJobStatus}.
     */
    private mapBullMqState(state: string): QueueJobStatus {
        switch (state) {
            case 'waiting':
            case 'delayed':
            case 'prioritized':
                return QUEUE_JOB_STATUS.pending;
            case 'active':
                return QUEUE_JOB_STATUS.processing;
            case 'completed':
                return QUEUE_JOB_STATUS.completed;
            case 'failed':
                return QUEUE_JOB_STATUS.failed;
            default:
                return QUEUE_JOB_STATUS.pending;
        }
    }

    // #endregion
}
