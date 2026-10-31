// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { QUEUE_JOB_STATUS } from '../models/IQueueJob.js';
import { VercelQueue } from './VercelQueue.js';

// #endregion

// #region Mocks

const mockSend = vi.fn();
const mockReceive = vi.fn();

vi.mock('@vercel/queue', () => ({
    PollingQueueClient: vi.fn().mockImplementation(function (this: Record<string, unknown>) {
        this.send = mockSend;
        this.receive = mockReceive;
    }),
}));

// #endregion

// #region Helpers

const DEFAULT_METADATA = {
    messageId: 'msg-1',
    deliveryCount: 1,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    expiresAt: new Date('2025-01-02T00:00:00.000Z'),
    topicName: 'orders',
    consumerGroup: 'test-consumer',
    region: 'iad1',
};

// #endregion

// #region Tests

describe('VercelQueue', () => {
    let client: VercelQueue;

    beforeEach(() => {
        client = new VercelQueue({
            region: 'iad1',
            consumerGroup: 'test-consumer',
            token: 'test-token',
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
            mockSend.mockResolvedValue({ messageId: 'msg-1' });

            // act
            const job = await client.enqueue('orders', payload);

            // assert
            expect(job.id).toBe('msg-1');
            expect(job.status).toBe(QUEUE_JOB_STATUS.pending);
            expect(job.payload).toEqual(payload);
            expect(job.queueName).toBe('orders');
            expect(job.attempts).toBe(0);
            expect(job.createdAt).toBeInstanceOf(Date);
            expect(job.startedAt).toBeNull();
            expect(job.completedAt).toBeNull();
            expect(job.failedAt).toBeNull();
            expect(job.errorMessage).toBeNull();
        });

        it('should call SDK send with the correct topic and payload', async () => {
            // arrange
            const payload = { email: 'test@example.com' };
            mockSend.mockResolvedValue({ messageId: 'msg-2' });

            // act
            await client.enqueue('emails', payload);

            // assert
            expect(mockSend).toHaveBeenCalledWith('emails', payload);
        });

        it('should generate a UUID when SDK returns null messageId', async () => {
            // arrange
            mockSend.mockResolvedValue({ messageId: null });

            // act
            const job = await client.enqueue('orders', { orderId: 1 });

            // assert
            expect(job.id).toBeDefined();
            expect(job.id.length).toBeGreaterThan(0);
        });

        it('should trim the queue name', async () => {
            // arrange
            mockSend.mockResolvedValue({ messageId: 'msg-3' });

            // act
            const job = await client.enqueue('  orders  ', { orderId: 1 });

            // assert
            expect(job.queueName).toBe('orders');
            expect(mockSend).toHaveBeenCalledWith('orders', { orderId: 1 });
        });

        it('should throw a validation error for an empty queue name', async () => {
            // act & assert
            await expect(client.enqueue('', { orderId: 1 })).rejects.toThrow(QueueValidationError);
        });

        it('should throw a validation error for a whitespace-only queue name', async () => {
            // act & assert
            await expect(client.enqueue('   ', { orderId: 1 })).rejects.toThrow(QueueValidationError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // dequeue
    // ──────────────────────────────────────────────────────────

    describe('dequeue', () => {
        it('should return a processing job when a message is available', async () => {
            // arrange
            const payload = { orderId: 42 };
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler(payload, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            // act
            const job = await client.dequeue('orders');

            // assert
            expect(job).not.toBeNull();
            expect(job!.id).toBe('msg-1');
            expect(job!.status).toBe(QUEUE_JOB_STATUS.processing);
            expect(job!.payload).toEqual(payload);
            expect(job!.queueName).toBe('orders');
            expect(job!.attempts).toBe(1);
            expect(job!.startedAt).toBeInstanceOf(Date);
        });

        it('should return null when the queue is empty', async () => {
            // arrange
            mockReceive.mockResolvedValue({ ok: false, reason: 'empty' });

            // act
            const job = await client.dequeue('orders');

            // assert
            expect(job).toBeNull();
        });

        it('should pass visibility timeout to the SDK', async () => {
            // arrange
            mockReceive.mockResolvedValue({ ok: false, reason: 'empty' });

            // act
            await client.dequeue('orders');

            // assert
            expect(mockReceive).toHaveBeenCalledWith('orders', 'test-consumer', expect.any(Function), {
                visibilityTimeoutSeconds: 300,
            });
        });

        it('should use custom visibility timeout when configured', async () => {
            // arrange
            const customClient = new VercelQueue({
                region: 'iad1',
                consumerGroup: 'test-consumer',
                visibilityTimeoutSeconds: 120,
            });
            mockReceive.mockResolvedValue({ ok: false, reason: 'empty' });

            // act
            await customClient.dequeue('orders');

            // assert
            expect(mockReceive).toHaveBeenCalledWith('orders', 'test-consumer', expect.any(Function), {
                visibilityTimeoutSeconds: 120,
            });
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
        it('should return a completed job and release the gate', async () => {
            // arrange
            const payload = { orderId: 42 };
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler(payload, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            const job = await client.dequeue('orders');

            // act
            const completed = await client.markCompleted(job!.id);

            // assert
            expect(completed.id).toBe('msg-1');
            expect(completed.status).toBe(QUEUE_JOB_STATUS.completed);
            expect(completed.completedAt).toBeInstanceOf(Date);
            expect(completed.failedAt).toBeNull();
            expect(completed.errorMessage).toBeNull();
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markCompleted('unknown-id')).rejects.toThrow(QueueJobNotFoundError);
        });

        it('should throw QueueJobNotFoundError when marking the same job twice', async () => {
            // arrange
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler({ orderId: 1 }, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            const job = await client.dequeue('orders');
            await client.markCompleted(job!.id);

            // act & assert
            await expect(client.markCompleted(job!.id)).rejects.toThrow(QueueJobNotFoundError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // markFailed
    // ──────────────────────────────────────────────────────────

    describe('markFailed', () => {
        it('should return a failed job with the error message', async () => {
            // arrange
            const payload = { orderId: 42 };
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler(payload, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            const job = await client.dequeue('orders');

            // act
            const failed = await client.markFailed(job!.id, 'Payment declined');

            // assert
            expect(failed.id).toBe('msg-1');
            expect(failed.status).toBe(QUEUE_JOB_STATUS.failed);
            expect(failed.failedAt).toBeInstanceOf(Date);
            expect(failed.errorMessage).toBe('Payment declined');
            expect(failed.completedAt).toBeNull();
        });

        it('should throw a validation error for an empty error message', async () => {
            // arrange
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler({ orderId: 1 }, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            const job = await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed(job!.id, '')).rejects.toThrow(QueueValidationError);
        });

        it('should throw a validation error for a whitespace-only error message', async () => {
            // arrange
            mockReceive.mockImplementation(
                async (_topic: string, _group: string, handler: (message: unknown, metadata: typeof DEFAULT_METADATA) => Promise<void>) => {
                    handler({ orderId: 1 }, { ...DEFAULT_METADATA });
                    return { ok: true };
                },
            );

            const job = await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed(job!.id, '   ')).rejects.toThrow(QueueValidationError);
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markFailed('unknown-id', 'some error')).rejects.toThrow(QueueJobNotFoundError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // getJobs
    // ──────────────────────────────────────────────────────────

    describe('getJobs', () => {
        it('should return jobs sorted by creation date', async () => {
            // arrange
            mockSend.mockResolvedValueOnce({ messageId: 'msg-1' }).mockResolvedValueOnce({ messageId: 'msg-2' });

            await client.enqueue('orders', { orderId: 1 });
            await client.enqueue('orders', { orderId: 2 });

            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toHaveLength(2);
            expect(jobs[0].id).toBe('msg-1');
            expect(jobs[1].id).toBe('msg-2');
        });

        it('should return only jobs for the specified queue', async () => {
            // arrange
            mockSend.mockResolvedValueOnce({ messageId: 'msg-1' }).mockResolvedValueOnce({ messageId: 'msg-2' });

            await client.enqueue('orders', { orderId: 1 });
            await client.enqueue('emails', { email: 'test@example.com' });

            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toHaveLength(1);
            expect(jobs[0].queueName).toBe('orders');
        });

        it('should return an empty array for a queue with no jobs', async () => {
            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toHaveLength(0);
        });

        it('should throw a validation error for an empty queue name', async () => {
            // act & assert
            await expect(client.getJobs('')).rejects.toThrow(QueueValidationError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // onModuleDestroy
    // ──────────────────────────────────────────────────────────

    describe('onModuleDestroy', () => {
        it('should clear all internal tracking', async () => {
            // arrange
            mockSend.mockResolvedValue({ messageId: 'msg-1' });
            await client.enqueue('orders', { orderId: 1 });

            // act
            await client.onModuleDestroy();

            // assert
            const jobs = await client.getJobs('orders');
            expect(jobs).toHaveLength(0);
        });
    });
});

// #endregion
