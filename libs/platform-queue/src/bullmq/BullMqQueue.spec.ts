// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueJobStateError } from '../errors/QueueJobStateError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { QUEUE_JOB_STATUS } from '../models/IQueueJob.js';
import { BullMqQueue } from './BullMqQueue.js';

// #endregion

// #region Mocks

const { mockQueueAdd, mockQueueGetJob, mockQueueGetJobs, mockQueueClose, mockWorkerGetNextJob, mockWorkerClose } = vi.hoisted(() => ({
    mockQueueAdd: vi.fn(),
    mockQueueGetJob: vi.fn(),
    mockQueueGetJobs: vi.fn(),
    mockQueueClose: vi.fn(),
    mockWorkerGetNextJob: vi.fn(),
    mockWorkerClose: vi.fn(),
}));

vi.mock('bullmq', () => {
    class MockQueue {
        public add = mockQueueAdd;
        public getJob = mockQueueGetJob;
        public getJobs = mockQueueGetJobs;
        public close = mockQueueClose;
    }

    class MockWorker {
        public getNextJob = mockWorkerGetNextJob;
        public close = mockWorkerClose;
    }

    return { Queue: MockQueue, Worker: MockWorker };
});

// #endregion

// #region Helpers

function createMockJob(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        id: 'job-1',
        queueName: 'orders',
        data: { orderId: 42 },
        attemptsMade: 0,
        timestamp: Date.now(),
        processedOn: null,
        finishedOn: null,
        isCompleted: false,
        isFailed: false,
        failedReason: null,
        getState: vi.fn().mockResolvedValue('active'),
        moveToCompleted: vi.fn().mockResolvedValue(undefined),
        moveToFailed: vi.fn().mockResolvedValue(undefined),
        ...overrides,
    };
}

// #endregion

// #region Tests

describe('BullMqQueue', () => {
    let client: BullMqQueue;

    beforeEach(() => {
        client = new BullMqQueue({ redisUrl: 'redis://localhost:6379' });
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
            const mockJob = createMockJob({ id: 'job-1', queueName: 'orders', data: payload });
            mockQueueAdd.mockResolvedValue(mockJob);

            // act
            const job = await client.enqueue('orders', payload);

            // assert
            expect(job.id).toBe('job-1');
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
        it('should return the next job in processing state', async () => {
            // arrange
            const mockJob = createMockJob();
            mockWorkerGetNextJob.mockResolvedValue(mockJob);

            // act
            const job = await client.dequeue('orders');

            // assert
            expect(job).not.toBeNull();
            expect(job?.id).toBe('job-1');
            expect(job?.status).toBe(QUEUE_JOB_STATUS.processing);
        });

        it('should return null when no jobs are available', async () => {
            // arrange
            mockWorkerGetNextJob.mockResolvedValue(undefined);

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
        it('should transition an active job to completed', async () => {
            // arrange
            const mockJob = createMockJob();
            mockQueueAdd.mockResolvedValue(mockJob);
            await client.enqueue('orders', { orderId: 42 });
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');
            mockQueueGetJob.mockResolvedValue(mockJob);

            // act
            const completed = await client.markCompleted('job-1');

            // assert
            expect(completed.status).toBe(QUEUE_JOB_STATUS.completed);
            expect(mockJob.moveToCompleted).toHaveBeenCalled();
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markCompleted('unknown-id')).rejects.toThrow(QueueJobNotFoundError);
        });

        it('should throw QueueJobStateError when job is not active', async () => {
            // arrange
            const mockJob = createMockJob({
                getState: vi.fn().mockResolvedValue('completed'),
            });
            mockQueueAdd.mockResolvedValue(mockJob);
            await client.enqueue('orders', { orderId: 42 });
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');
            mockQueueGetJob.mockResolvedValue(mockJob);

            // act & assert
            await expect(client.markCompleted('job-1')).rejects.toThrow(QueueJobStateError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // markFailed
    // ──────────────────────────────────────────────────────────

    describe('markFailed', () => {
        it('should transition an active job to failed', async () => {
            // arrange
            const mockJob = createMockJob();
            mockQueueAdd.mockResolvedValue(mockJob);
            await client.enqueue('orders', { orderId: 42 });
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');
            mockQueueGetJob.mockResolvedValue(mockJob);

            // act
            const failed = await client.markFailed('job-1', 'timeout');

            // assert
            expect(failed.status).toBe(QUEUE_JOB_STATUS.failed);
            expect(failed.errorMessage).toBe('timeout');
            expect(mockJob.moveToFailed).toHaveBeenCalled();
        });

        it('should throw QueueJobNotFoundError for an unknown job ID', async () => {
            // act & assert
            await expect(client.markFailed('unknown-id', 'error')).rejects.toThrow(QueueJobNotFoundError);
        });

        it('should throw QueueValidationError for an empty error message', async () => {
            // arrange
            const mockJob = createMockJob();
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed('job-1', '')).rejects.toThrow(QueueValidationError);
        });

        it('should throw QueueValidationError for a whitespace-only error message', async () => {
            // arrange
            const mockJob = createMockJob();
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');

            // act & assert
            await expect(client.markFailed('job-1', '   ')).rejects.toThrow(QueueValidationError);
        });

        it('should throw QueueJobStateError when job is not active', async () => {
            // arrange
            const mockJob = createMockJob({
                getState: vi.fn().mockResolvedValue('completed'),
            });
            mockQueueAdd.mockResolvedValue(mockJob);
            await client.enqueue('orders', { orderId: 42 });
            mockWorkerGetNextJob.mockResolvedValue(mockJob);
            await client.dequeue('orders');
            mockQueueGetJob.mockResolvedValue(mockJob);

            // act & assert
            await expect(client.markFailed('job-1', 'error')).rejects.toThrow(QueueJobStateError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // getJobs
    // ──────────────────────────────────────────────────────────

    describe('getJobs', () => {
        it('should return an empty array for an unknown queue', async () => {
            // act
            const jobs = await client.getJobs('unknown');

            // assert
            expect(jobs).toEqual([]);
        });

        it('should return sorted jobs after enqueue', async () => {
            // arrange
            const now = Date.now();
            const mockJobs = [createMockJob({ id: 'job-2', timestamp: now + 100 }), createMockJob({ id: 'job-1', timestamp: now })];
            mockQueueAdd.mockResolvedValue(createMockJob());
            await client.enqueue('orders', { id: 1 });
            mockQueueGetJobs.mockResolvedValue(mockJobs);

            // act
            const jobs = await client.getJobs('orders');

            // assert
            expect(jobs).toHaveLength(2);
            expect(jobs[0].id).toBe('job-1');
            expect(jobs[1].id).toBe('job-2');
        });
    });

    // ──────────────────────────────────────────────────────────
    // onModuleDestroy
    // ──────────────────────────────────────────────────────────

    describe('onModuleDestroy', () => {
        it('should close all queues and workers', async () => {
            // arrange
            mockQueueAdd.mockResolvedValue(createMockJob());
            mockWorkerGetNextJob.mockResolvedValue(createMockJob());
            await client.enqueue('orders', { id: 1 });
            await client.dequeue('orders');

            // act
            await client.onModuleDestroy();

            // assert
            expect(mockQueueClose).toHaveBeenCalled();
            expect(mockWorkerClose).toHaveBeenCalled();
        });
    });
});

// #endregion
