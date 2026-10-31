// #region Imports

import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver, ServiceBusSender } from '@azure/service-bus';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { IQueue } from '../interfaces/IQueue.js';
import { IQueueJob, QUEUE_JOB_STATUS } from '../models/IQueueJob.js';

// #endregion

/**
 * Configuration options for {@link AzureQueue}.
 *
 * @public
 */
export interface IAzureQueueOptions {
    // #region Properties

    /**
     * Azure Service Bus connection string.
     *
     * @example `Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=...;SharedAccessKey=...`
     * @public
     */
    connectionString: string;

    /**
     * Maximum wait time in milliseconds when receiving messages.
     *
     * @defaultValue 5_000
     * @public
     */
    receiveWaitMs?: number;

    // #endregion
}

/**
 * Azure Service Bus queue implementation.
 *
 * Uses Azure Service Bus for cloud-native, enterprise-grade messaging.
 * Operates in peek-lock mode: dequeued messages remain locked until
 * explicitly completed or dead-lettered.
 *
 * @remarks
 * Senders and receivers are lazily created per queue name and cached for
 * the lifetime of the instance. Call {@link onModuleDestroy} (handled
 * automatically by NestJS) to release all underlying connections.
 *
 * @public
 */
@Injectable()
export class AzureQueue implements IQueue, OnModuleDestroy {
    // #region Fields

    private readonly _logger: Logger = new Logger(AzureQueue.name);
    private readonly _client: ServiceBusClient;
    private readonly _senders: Map<string, ServiceBusSender> = new Map();
    private readonly _receivers: Map<string, ServiceBusReceiver> = new Map();
    private readonly _receivedMessages: Map<string, { queueName: string; message: ServiceBusReceivedMessage }> = new Map();
    private readonly _receiveWaitMs: number;

    // #endregion

    // #region Ctor

    /**
     * Creates a new {@link AzureQueue} instance.
     *
     * @param options - Connection and receive configuration. See {@link IAzureQueueOptions}.
     */
    public constructor(options: IAzureQueueOptions) {
        this._client = new ServiceBusClient(options.connectionString);
        this._receiveWaitMs = options.receiveWaitMs ?? 5_000;
    }

    // #endregion

    // #region Methods

    /** {@inheritDoc IQueue.enqueue} */
    public async enqueue<T = unknown>(queueName: string, payload: T): Promise<IQueueJob<T>> {
        const normalizedName = this.normalizeQueueName(queueName);
        const sender = this.getOrCreateSender(normalizedName);

        const messageId = randomUUID();

        await sender.sendMessages({
            messageId,
            body: payload,
            contentType: 'application/json',
        });

        this._logger.debug(`Enqueued job '${messageId}' into queue '${normalizedName}'.`);

        return {
            id: messageId,
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
    }

    /** {@inheritDoc IQueue.dequeue} */
    public async dequeue(queueName: string): Promise<IQueueJob | null> {
        const normalizedName = this.normalizeQueueName(queueName);
        const receiver = this.getOrCreateReceiver(normalizedName);

        const [message] = await receiver.receiveMessages(1, {
            maxWaitTimeInMs: this._receiveWaitMs,
        });

        if (!message) {
            return null;
        }

        const jobId = String(message.messageId ?? randomUUID());
        this._receivedMessages.set(jobId, { queueName: normalizedName, message });

        this._logger.debug(`Dequeued job '${jobId}' from queue '${normalizedName}'.`);

        return {
            id: jobId,
            queueName: normalizedName,
            payload: message.body,
            status: QUEUE_JOB_STATUS.processing,
            attempts: message.deliveryCount ?? 1,
            createdAt: message.enqueuedTimeUtc ?? new Date(),
            startedAt: new Date(),
            completedAt: null,
            failedAt: null,
            errorMessage: null,
        };
    }

    /** {@inheritDoc IQueue.markCompleted} */
    public async markCompleted(jobId: string): Promise<IQueueJob> {
        const meta = this._receivedMessages.get(jobId);

        if (!meta) {
            throw new QueueJobNotFoundError(jobId);
        }

        const receiver = this._receivers.get(meta.queueName);

        if (!receiver) {
            throw new QueueJobNotFoundError(jobId);
        }

        await receiver.completeMessage(meta.message);
        this._receivedMessages.delete(jobId);

        this._logger.debug(`Completed job '${jobId}'.`);

        return {
            id: jobId,
            queueName: meta.queueName,
            payload: meta.message.body,
            status: QUEUE_JOB_STATUS.completed,
            attempts: meta.message.deliveryCount ?? 1,
            createdAt: meta.message.enqueuedTimeUtc ?? new Date(),
            startedAt: new Date(),
            completedAt: new Date(),
            failedAt: null,
            errorMessage: null,
        };
    }

    /** {@inheritDoc IQueue.markFailed} */
    public async markFailed(jobId: string, errorMessage: string): Promise<IQueueJob> {
        const normalizedMessage = errorMessage.trim();

        if (normalizedMessage.length === 0) {
            throw new QueueValidationError('Queue job error message must not be empty.');
        }

        const meta = this._receivedMessages.get(jobId);

        if (!meta) {
            throw new QueueJobNotFoundError(jobId);
        }

        const receiver = this._receivers.get(meta.queueName);

        if (!receiver) {
            throw new QueueJobNotFoundError(jobId);
        }

        await receiver.deadLetterMessage(meta.message, {
            deadLetterReason: normalizedMessage,
            deadLetterErrorDescription: normalizedMessage,
        });
        this._receivedMessages.delete(jobId);

        this._logger.debug(`Failed job '${jobId}': ${normalizedMessage}`);

        return {
            id: jobId,
            queueName: meta.queueName,
            payload: meta.message.body,
            status: QUEUE_JOB_STATUS.failed,
            attempts: meta.message.deliveryCount ?? 1,
            createdAt: meta.message.enqueuedTimeUtc ?? new Date(),
            startedAt: new Date(),
            completedAt: null,
            failedAt: new Date(),
            errorMessage: normalizedMessage,
        };
    }

    /** {@inheritDoc IQueue.getJobs} */
    public async getJobs(queueName: string): Promise<ReadonlyArray<IQueueJob>> {
        const normalizedName = this.normalizeQueueName(queueName);
        const receiver = this.getOrCreateReceiver(normalizedName);

        const messages = await receiver.peekMessages(100);

        return messages.map((message) => ({
            id: String(message.messageId ?? ''),
            queueName: normalizedName,
            payload: message.body,
            status: QUEUE_JOB_STATUS.pending,
            attempts: message.deliveryCount ?? 0,
            createdAt: message.enqueuedTimeUtc ?? new Date(),
            startedAt: null,
            completedAt: null,
            failedAt: null,
            errorMessage: null,
        }));
    }

    /**
     * Closes all senders, receivers, and the underlying Service Bus client.
     *
     * Called automatically by the NestJS lifecycle when the module is destroyed.
     */
    public async onModuleDestroy(): Promise<void> {
        for (const sender of this._senders.values()) {
            await sender.close();
        }

        for (const receiver of this._receivers.values()) {
            await receiver.close();
        }

        await this._client.close();

        this._senders.clear();
        this._receivers.clear();
        this._receivedMessages.clear();
    }

    /**
     * Retrieves or creates a {@link ServiceBusSender} for the given queue.
     *
     * @param queueName - Normalised queue name.
     * @returns The cached or newly created sender.
     */
    private getOrCreateSender(queueName: string): ServiceBusSender {
        const existingSender = this._senders.get(queueName);

        if (existingSender) {
            return existingSender;
        }

        const sender = this._client.createSender(queueName);
        this._senders.set(queueName, sender);

        return sender;
    }

    /**
     * Retrieves or creates a {@link ServiceBusReceiver} for the given queue.
     *
     * @param queueName - Normalised queue name.
     * @returns The cached or newly created receiver.
     */
    private getOrCreateReceiver(queueName: string): ServiceBusReceiver {
        const existingReceiver = this._receivers.get(queueName);

        if (existingReceiver) {
            return existingReceiver;
        }

        const receiver = this._client.createReceiver(queueName);
        this._receivers.set(queueName, receiver);

        return receiver;
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
