// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { QUEUE_JOB_STATUS } from '../models/IQueueJob.js';
import { AzureQueue } from './AzureQueue.js';

// #endregion

// #region Mocks

const {
    mockSendMessages,
    mockReceiveMessages,
    mockPeekMessages,
    mockCompleteMessage,
    mockDeadLetterMessage,
    mockSenderClose,
    mockReceiverClose,
    mockClientClose,
} = vi.hoisted(() => ({
    mockSendMessages: vi.fn(),
    mockReceiveMessages: vi.fn(),
    mockPeekMessages: vi.fn(),
    mockCompleteMessage: vi.fn(),
    mockDeadLetterMessage: vi.fn(),
    mockSenderClose: vi.fn(),
    mockReceiverClose: vi.fn(),
    mockClientClose: vi.fn(),
}));

vi.mock('@azure/service-bus', () => {
    class MockServiceBusClient {
        public createSender = vi.fn().mockReturnValue({
            sendMessages: mockSendMessages,
            close: mockSenderClose,
        });

        public createReceiver = vi.fn().mockReturnValue({
            receiveMessages: mockReceiveMessages,
            peekMessages: mockPeekMessages,
            completeMessage: mockCompleteMessage,
            deadLetterMessage: mockDeadLetterMessage,
            close: mockReceiverClose,
        });

        public close = mockClientClose;
    }

    return { ServiceBusClient: MockServiceBusClient };
});

// #endregion

// #region Helpers

function createMockMessage(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        messageId: 'msg-1',
        body: { orderId: 42 },
        deliveryCount: 1,
        enqueuedTimeUtc: new Date('2025-01-01T00:00:00Z'),
        ...overrides,
    };
}

// #endregion

// #region Tests

describe('AzureQueue', () => {
    let client: AzureQueue;

    beforeEach(() => {
        client = new AzureQueue({
            connectionString: 'Endpoint=sb://test.servicebus.windows.net/;SharedAccessKeyName=test;SharedAccessKey=test',
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // ──────────────────────────────────────────────────────────
    // enqueue
    // ──────────────────────────────────────────────────────────

    describe('enqueue', () => {
        it('should create a pending job with the given payload', async () => {
            // arrange
            const payload = { orderId: 42 };
            mockSendMessages.mockResolvedValue(undefined);

            // act
            const job = await client.enqueue('orders', payload);

            // assert
            expect(job.status).toBe(QUEUE_JOB_STATUS.pending);
            expect(job.payload).toEqual(payload);
            expect(job.queueName).toBe('orders');
            expect(job.attempts).toBe(0);
            expect(job.createdAt).toBeInstanceOf(Date);
            expect(job.startedAt).toBeNull();
            expect(job.completedAt).toBeNull();
            expect(job.failedAt).toBeNull();
            expect(job.errorMessage).toBeNull();
            expect(mockSendMessages).toHaveBeenCalledWith(
                expect.objectContaining({
                    body: payload,
                    contentType: 'application/json',
                }),
            );
        });

        it('should throw a validation error for an empty queue name', async () => {
            // act & assert
            await expect(client.enqueue('', { data: 1 })).rejects.toThrow(QueueValidationError);
        });

        it('should trim whitespace-only queue names and throw', async () => {
            // act & assert
            await expect(client.enqueue('   ', { data: 1 })).rejects.toThrow(QueueValidationError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // dequeue
    // ──────────────────────────────────────────────────────────

    describe('dequeue', () => {
        it('should return the next message in processing state', async () => {
            // arrange
            const mockMessage = createMockMessage();
            mockReceiveMessages.mockResolvedValue([mockMessage]);

            // act
            const job = await client.dequeue('orders');

            // assert
            expect(job).not.toBeNull();
            expect(job?.id).toBe('msg-1');
            expect(job?.status).toBe(QUEUE_JOB_STATUS.processing);
            expect(job?.payload).toEqual({ orderId: 42 });
        });

        it('should return null when no messages are available', async () => {
            // arrange
            mockReceiveMessages.mockResolvedValue([]);

            // act
            const job = await client.dequeue('orders');

            // assert
            expect(job).toBeNull();
        });

        it('should throw a validation error for an empty queue name', async () => {
            // act & assert
            await expect(client.dequeue('')).rejects.toThrow(QueueValidationError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // markCompleted
    // ──────────────────────────────────────────────────────────

    describe('markCompleted', () => {
        it('should complete a dequeued message', async () => {
            // arrange
            const mockMessage = createMockMessage();
            mockReceiveMessages.mockResolvedValue([mockMessage]);
            await client.dequeue('orders');
            mockCompleteMessage.mockResolvedValue(undefined);

            // act
            const completed = await client.markCompleted('msg-1');

            // assert
            expect(completed.status).toBe(QUEUE_JOB_STATUS.completed);
            expect(completed.completedAt).toBeInstanceOf(Date);
            expect(mockCompleteMessage).toHaveBeenCalledWith(mockMessage);
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markCompleted('unknown-id')).rejects.toThrow(QueueJobNotFoundError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // markFailed
    // ──────────────────────────────────────────────────────────

    describe('markFailed', () => {
        it('should dead-letter a dequeued message', async () => {
            // arrange
            const mockMessage = createMockMessage();
            mockReceiveMessages.mockResolvedValue([mockMessage]);
            await client.dequeue('orders');
            mockDeadLetterMessage.mockResolvedValue(undefined);

            // act
            const failed = await client.markFailed('msg-1', 'timeout');

            // assert
            expect(failed.status).toBe(QUEUE_JOB_STATUS.failed);
            expect(failed.errorMessage).toBe('timeout');
            expect(failed.failedAt).toBeInstanceOf(Date);
            expect(mockDeadLetterMessage).toHaveBeenCalledWith(mockMessage, expect.objectContaining({ deadLetterReason: 'timeout' }));
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markFailed('unknown-id', 'error')).rejects.toThrow(QueueJobNotFoundError);
        });

        it('should throw QueueValidationError for an empty error message', async () => {
            // arrange
            const mockMessage = createMockMessage();
            mockReceiveMessages.mockResolvedValue([mockMessage]);
            await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed('msg-1', '')).rejects.toThrow(QueueValidationError);
        });

        it('should throw QueueValidationError for a whitespace-only error message', async () => {
            // arrange
            const mockMessage = createMockMessage();
            mockReceiveMessages.mockResolvedValue([mockMessage]);
            await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed('msg-1', '   ')).rejects.toThrow(QueueValidationError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // getJobs
    // ──────────────────────────────────────────────────────────

    describe('getJobs', () => {
        it('should return peeked messages as pending jobs', async () => {
            // arrange
            const mockMessages = [createMockMessage({ messageId: 'msg-1' }), createMockMessage({ messageId: 'msg-2' })];
            mockPeekMessages.mockResolvedValue(mockMessages);

            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toHaveLength(2);
            expect(jobs[0].id).toBe('msg-1');
            expect(jobs[1].id).toBe('msg-2');
            expect(jobs[0].status).toBe(QUEUE_JOB_STATUS.pending);
        });

        it('should return an empty array when no messages exist', async () => {
            // arrange
            mockPeekMessages.mockResolvedValue([]);

            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toEqual([]);
        });
    });

    // ──────────────────────────────────────────────────────────
    // onModuleDestroy
    // ──────────────────────────────────────────────────────────

    describe('onModuleDestroy', () => {
        it('should close senders, receivers, and client', async () => {
            // arrange
            mockSendMessages.mockResolvedValue(undefined);
            mockReceiveMessages.mockResolvedValue([createMockMessage()]);
            await client.enqueue('orders', { id: 1 });
            await client.dequeue('orders');

            // act
            await client.onModuleDestroy();

            // assert
            expect(mockSenderClose).toHaveBeenCalled();
            expect(mockReceiverClose).toHaveBeenCalled();
            expect(mockClientClose).toHaveBeenCalled();
        });
    });
});

// #endregion
