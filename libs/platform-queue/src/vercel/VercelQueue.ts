// #region Imports

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PollingQueueClient } from '@vercel/queue';
import { randomUUID } from 'crypto';

import { QueueError } from '../errors/QueueError.js';
import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { IQueue } from '../interfaces/IQueue.js';
import { IQueueJob, QUEUE_JOB_STATUS } from '../models/IQueueJob.js';

// #endregion

/**
 * Metadata supplied by the SDK handler callback.
 *
 * @internal
 */
interface IVercelMessageMetadata {
    readonly messageId: string;
    readonly deliveryCount: number;
    readonly createdAt: Date;
    readonly expiresAt: Date;
    readonly topicName: string;
    readonly consumerGroup: string;
    readonly region: string;
}

/**
 * Configuration options for {@link VercelQueue}.
 *
 * @public
 */
export interface IVercelQueueOptions {
    // #region Properties

    /**
     * Vercel region code (e.g. `iad1`, `fra1`, `sfo1`).
     *
     * Required — messages can only be consumed from the region they were
     * sent to. Use a fixed region for both sending and receiving.
     *
     * @public
     */
    region: string;

    /**
     * Consumer group name used when receiving messages.
     *
     * Each consumer group independently tracks its position in the topic.
     *
     * @public
     */
    consumerGroup: string;

    /**
     * Vercel OIDC bearer token for authentication.
     *
     * When omitted the SDK auto-fetches a token via OIDC.
     *
     * @public
     */
    token?: string;

    /**
     * Deployment ID for per-deployment message isolation.
     *
     * - `undefined` — auto-detected from `VERCEL_DEPLOYMENT_ID` (pinned).
     * - `null` — unpinned (messages shared across deployments).
     * - Explicit string — pinned to the given deployment.
     *
     * @public
     */
    deploymentId?: string | null;

    /**
     * Visibility timeout in seconds for received messages.
     *
     * The SDK automatically re-extends the lease while the handler is
     * running, so the default of 300 s is suitable for most workloads.
     *
     * @defaultValue 300
     * @public
     */
    visibilityTimeoutSeconds?: number;

    // #endregion
}

/**
 * Vercel Queues implementation of the {@link IQueue} contract.
 *
 * Uses the official `@vercel/queue` SDK (`PollingQueueClient`) for
 * durable, serverless message streaming. Messages are published to
 * topics and consumed via poll-based consumer groups.
 *
 * @remarks
 * This adapter maps the topic/consumer-group model to the
 * {@link IQueue} interface by treating topic names as queue names.
 *
 * {@link dequeue} calls `receive()` on the SDK. The handler callback
 * is suspended via an internal gate promise until
 * {@link markCompleted} or {@link markFailed} is invoked, at which
 * point the handler completes and the SDK auto-acknowledges the
 * message. This gives callers explicit control over the job lifecycle
 * while relying on the SDK for authentication, serialisation, and
 * visibility-timeout extension.
 *
 * Both {@link markCompleted} and {@link markFailed} acknowledge
 * (remove) the message. If retry behaviour is desired, re-enqueue
 * the job explicitly.
 *
 * @public
 */
@Injectable()
export class VercelQueue implements IQueue, OnModuleDestroy {
    // #region Fields

    private readonly _logger: Logger = new Logger(VercelQueue.name);
    private readonly _client: PollingQueueClient;
    private readonly _consumerGroup: string;
    private readonly _visibilityTimeoutSeconds: number;

    /**
     * Gate resolvers keyed by job ID.
     *
     * Resolving the gate causes the SDK handler callback to complete,
     * which in turn triggers automatic message acknowledgement.
     */
    private readonly _gates: Map<string, () => void> = new Map();

    /**
     * Metadata for jobs that have been dequeued but not yet completed
     * or failed. Keyed by job ID.
     */
    private readonly _pendingJobs: Map<string, { queueName: string; payload: unknown; metadata: IVercelMessageMetadata }> = new Map();

    /**
     * In-memory job tracking for {@link getJobs}.
     *
     * Vercel Queues does not expose a peek/list API, so all known
     * jobs are tracked here.
     */
    private readonly _jobs: Map<string, IQueueJob> = new Map();

    // #endregion

    // #region Ctor

    /**
     * Creates a new {@link VercelQueue} instance.
     *
     * @param options - Region, consumer group, and optional SDK configuration.
     *                  See {@link IVercelQueueOptions}.
     */
    public constructor(options: IVercelQueueOptions) {
        this._client = new PollingQueueClient({
            region: options.region,
            ...(options.token !== undefined && { token: options.token }),
            ...(options.deploymentId !== undefined && { deploymentId: options.deploymentId }),
        });
        this._consumerGroup = options.consumerGroup;
        this._visibilityTimeoutSeconds = options.visibilityTimeoutSeconds ?? 300;
    }

    // #endregion

    // #region Methods

    /** {@inheritDoc IQueue.enqueue} */
    public async enqueue<T = unknown>(queueName: string, payload: T): Promise<IQueueJob<T>> {
        const normalizedName = this.normalizeQueueName(queueName);

        const { messageId } = await this._client.send(normalizedName, payload);

        const now = new Date();
        const job: IQueueJob<T> = {
            id: messageId ?? randomUUID(),
            queueName: normalizedName,
            payload,
            status: QUEUE_JOB_STATUS.pending,
            attempts: 0,
            createdAt: now,
            startedAt: null,
            completedAt: null,
            failedAt: null,
            errorMessage: null,
        };

        this._jobs.set(job.id, job as IQueueJob);

        this._logger.debug(`Enqueued job '${job.id}' into queue '${normalizedName}'.`);

        return job;
    }

    /** {@inheritDoc IQueue.dequeue} */
    public async dequeue(queueName: string): Promise<IQueueJob | null> {
        const normalizedName = this.normalizeQueueName(queueName);

        return new Promise<IQueueJob | null>((resolveDequeue, rejectDequeue) => {
            const receivePromise = this._client.receive<unknown>(
                normalizedName,
                this._consumerGroup,
                async (message: unknown, metadata: IVercelMessageMetadata) => {
                    const job: IQueueJob = {
                        id: metadata.messageId,
                        queueName: normalizedName,
                        payload: message,
                        status: QUEUE_JOB_STATUS.processing,
                        attempts: metadata.deliveryCount,
                        createdAt: metadata.createdAt,
                        startedAt: new Date(),
                        completedAt: null,
                        failedAt: null,
                        errorMessage: null,
                    };

                    this._jobs.set(job.id, job);
                    this._pendingJobs.set(job.id, { queueName: normalizedName, payload: message, metadata });

                    await new Promise<void>((resolveGate) => {
                        this._gates.set(job.id, resolveGate);
                        resolveDequeue(job);
                    });
                },
                { visibilityTimeoutSeconds: this._visibilityTimeoutSeconds },
            );

            receivePromise
                .then((result) => {
                    if (!result.ok) {
                        resolveDequeue(null);
                    }
                })
                .catch((error: unknown) => {
                    this._logger.error(`Vercel Queues receive error: ${error instanceof Error ? error.message : String(error)}`);
                    rejectDequeue(new QueueError(`Vercel Queues receive failed: ${error instanceof Error ? error.message : String(error)}`));
                });
        });
    }

    /** {@inheritDoc IQueue.markCompleted} */
    public async markCompleted(jobId: string): Promise<IQueueJob> {
        const gate = this._gates.get(jobId);
        const pending = this._pendingJobs.get(jobId);

        if (!gate || !pending) {
            throw new QueueJobNotFoundError(jobId);
        }

        gate();

        this._gates.delete(jobId);
        this._pendingJobs.delete(jobId);

        const now = new Date();
        const job: IQueueJob = {
            id: jobId,
            queueName: pending.queueName,
            payload: pending.payload,
            status: QUEUE_JOB_STATUS.completed,
            attempts: pending.metadata.deliveryCount,
            createdAt: pending.metadata.createdAt,
            startedAt: now,
            completedAt: now,
            failedAt: null,
            errorMessage: null,
        };

        this._jobs.set(jobId, job);

        this._logger.debug(`Completed job '${jobId}'.`);

        return job;
    }

    /** {@inheritDoc IQueue.markFailed} */
    public async markFailed(jobId: string, errorMessage: string): Promise<IQueueJob> {
        const normalizedMessage = errorMessage.trim();

        if (normalizedMessage.length === 0) {
            throw new QueueValidationError('Queue job error message must not be empty.');
        }

        const gate = this._gates.get(jobId);
        const pending = this._pendingJobs.get(jobId);

        if (!gate || !pending) {
            throw new QueueJobNotFoundError(jobId);
        }

        gate();

        this._gates.delete(jobId);
        this._pendingJobs.delete(jobId);

        const now = new Date();
        const job: IQueueJob = {
            id: jobId,
            queueName: pending.queueName,
            payload: pending.payload,
            status: QUEUE_JOB_STATUS.failed,
            attempts: pending.metadata.deliveryCount,
            createdAt: pending.metadata.createdAt,
            startedAt: now,
            completedAt: null,
            failedAt: now,
            errorMessage: normalizedMessage,
        };

        this._jobs.set(jobId, job);

        this._logger.debug(`Failed job '${jobId}': ${normalizedMessage}`);

        return job;
    }

    /** {@inheritDoc IQueue.getJobs} */
    public async getJobs(queueName: string): Promise<ReadonlyArray<IQueueJob>> {
        const normalizedName = this.normalizeQueueName(queueName);

        return Array.from(this._jobs.values())
            .filter((job) => job.queueName === normalizedName)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    /**
     * Releases all pending gates and clears internal tracking maps.
     *
     * Releasing the gates causes pending SDK handlers to complete
     * normally, acknowledging in-flight messages. This prevents
     * dangling handlers during graceful shutdown.
     */
    public async onModuleDestroy(): Promise<void> {
        for (const gate of this._gates.values()) {
            gate();
        }

        this._gates.clear();
        this._pendingJobs.clear();
        this._jobs.clear();
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

    // #endregion
}
