// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { QueueJobNotFoundError } from '../errors/QueueJobNotFoundError.js';
import { QueueJobStateError } from '../errors/QueueJobStateError.js';
import { QueueValidationError } from '../errors/QueueValidationError.js';
import { QUEUE_JOB_STATUS } from '../models/IQueueJob.js';
import { MemoryQueue } from './MemoryQueue.js';

// #endregion

// #region Tests

describe('MemoryQueue', () => {
    let client: MemoryQueue;

    beforeEach(() => {
        client = new MemoryQueue();
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
            const payload = { documentId: 1 };

            // act
            const job = await client.enqueue('documents', payload);

            // assert
            expect(job.status).toBe(QUEUE_JOB_STATUS.pending);
            expect(job.payload).toEqual(payload);
            expect(job.queueName).toBe('documents');
            expect(job.attempts).toBe(0);
            expect(job.createdAt).toBeInstanceOf(Date);
            expect(job.startedAt).toBeNull();
            expect(job.completedAt).toBeNull();
            expect(job.failedAt).toBeNull();
            expect(job.errorMessage).toBeNull();
        });

        it('should assign unique IDs to each job', async () => {
            // arrange & act
            const first = await client.enqueue('mail', { id: 1 });
            const second = await client.enqueue('mail', { id: 2 });

            // assert
            expect(first.id).not.toBe(second.id);
        });

        it('should throw a validation error for an empty queue name', async () => {
            // act & assert
            await expect(client.enqueue('   ', { documentId: 1 })).rejects.toThrow(QueueValidationError);
            await expect(client.enqueue('   ', { documentId: 1 })).rejects.toThrow('Queue name must not be empty.');
        });

        it('should trim the queue name', async () => {
            // act
            const job = await client.enqueue('  reports  ', { reportId: 1 });

            // assert
            expect(job.queueName).toBe('reports');
        });
    });

    // ──────────────────────────────────────────────────────────
    // dequeue
    // ──────────────────────────────────────────────────────────

    describe('dequeue', () => {
        it('should return jobs in FIFO order', async () => {
            // arrange
            const firstJob = await client.enqueue('documents', { documentId: 1 });
            await client.enqueue('documents', { documentId: 2 });

            // act
            const dequeuedJob = await client.dequeue('documents');

            // assert
            expect(dequeuedJob?.id).toBe(firstJob.id);
            expect(dequeuedJob?.status).toBe(QUEUE_JOB_STATUS.processing);
            expect(dequeuedJob?.attempts).toBe(1);
            expect(dequeuedJob?.startedAt).toBeInstanceOf(Date);
        });

        it('should return null when the queue is empty', async () => {
            // act
            const result = await client.dequeue('non-existent');

            // assert
            expect(result).toBeNull();
        });

        it('should skip processing jobs and return the next pending one', async () => {
            // arrange
            await client.enqueue('mail', { id: 1 });
            const secondJob = await client.enqueue('mail', { id: 2 });
            await client.dequeue('mail'); // picks up first job

            // act
            const result = await client.dequeue('mail');

            // assert
            expect(result?.id).toBe(secondJob.id);
        });

        it('should return null when all jobs are already processing', async () => {
            // arrange
            await client.enqueue('mail', { id: 1 });
            await client.dequeue('mail');

            // act
            const result = await client.dequeue('mail');

            // assert
            expect(result).toBeNull();
        });
    });

    // ──────────────────────────────────────────────────────────
    // markCompleted
    // ──────────────────────────────────────────────────────────

    describe('markCompleted', () => {
        it('should mark a processing job as completed', async () => {
            // arrange
            const queuedJob = await client.enqueue('mail', { messageId: 10 });
            await client.dequeue('mail');

            // act
            const completedJob = await client.markCompleted(queuedJob.id);

            // assert
            expect(completedJob.status).toBe(QUEUE_JOB_STATUS.completed);
            expect(completedJob.completedAt).toBeInstanceOf(Date);
            expect(completedJob.errorMessage).toBeNull();
        });

        it('should throw a state error when the job is not processing', async () => {
            // arrange
            const queuedJob = await client.enqueue('mail', { messageId: 10 });

            // act & assert
            await expect(client.markCompleted(queuedJob.id)).rejects.toThrow(QueueJobStateError);
        });

        it('should throw a not-found error for an unknown job ID', async () => {
            // act & assert
            await expect(client.markCompleted('unknown-123')).rejects.toThrow(QueueJobNotFoundError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // markFailed
    // ──────────────────────────────────────────────────────────

    describe('markFailed', () => {
        it('should mark a processing job as failed with an error message', async () => {
            // arrange
            const queuedJob = await client.enqueue('billing', { invoiceId: 3 });
            await client.dequeue('billing');

            // act
            const failedJob = await client.markFailed(queuedJob.id, 'Remote API timeout');

            // assert
            expect(failedJob.status).toBe(QUEUE_JOB_STATUS.failed);
            expect(failedJob.errorMessage).toBe('Remote API timeout');
            expect(failedJob.failedAt).toBeInstanceOf(Date);
        });

        it('should throw a validation error for an empty error message', async () => {
            // arrange
            const queuedJob = await client.enqueue('billing', { invoiceId: 3 });
            await client.dequeue('billing');

            // act & assert
            await expect(client.markFailed(queuedJob.id, '   ')).rejects.toThrow(QueueValidationError);
            await expect(client.markFailed(queuedJob.id, '   ')).rejects.toThrow('Queue job error message must not be empty.');
        });

        it('should throw a state error when the job is not processing', async () => {
            // arrange
            const queuedJob = await client.enqueue('billing', { invoiceId: 3 });

            // act & assert
            await expect(client.markFailed(queuedJob.id, 'some error')).rejects.toThrow(QueueJobStateError);
        });

        it('should throw a not-found error for an unknown job ID', async () => {
            // act & assert
            await expect(client.markFailed('unknown-123', 'some error')).rejects.toThrow(QueueJobNotFoundError);
        });
    });

    // ──────────────────────────────────────────────────────────
    // getJobs
    // ──────────────────────────────────────────────────────────

    describe('getJobs', () => {
        it('should return all jobs for a given queue in insertion order', async () => {
            // arrange
            await client.enqueue('reports', { reportId: 1 });
            await client.enqueue('reports', { reportId: 2 });
            await client.enqueue('other', { otherId: 1 });

            // act
            const jobs = await client.getJobs('reports');

            // assert
            expect(jobs).toHaveLength(2);
            expect(jobs[0].queueName).toBe('reports');
            expect(jobs[1].queueName).toBe('reports');
        });

        it('should return an empty array for an unknown queue', async () => {
            // act
            const jobs = await client.getJobs('unknown');

            // assert
            expect(jobs).toHaveLength(0);
        });
    });

    // ──────────────────────────────────────────────────────────
    // capacity enforcement
    // ──────────────────────────────────────────────────────────

    describe('capacity enforcement', () => {
        it('should evict completed jobs when capacity is reached', async () => {
            // arrange
            const smallClient = new MemoryQueue({ maxJobs: 3 });
            const job1 = await smallClient.enqueue('q', { id: 1 });
            await smallClient.enqueue('q', { id: 2 });
            await smallClient.enqueue('q', { id: 3 });
            await smallClient.dequeue('q');
            await smallClient.markCompleted(job1.id);

            // act — this enqueue triggers eviction of the completed job
            await smallClient.enqueue('q', { id: 4 });

            // assert
            const jobs = await smallClient.getJobs('q');
            const ids = jobs.map((j) => j.payload);
            expect(ids).not.toContainEqual({ id: 1 });
            expect(jobs).toHaveLength(3);
        });
    });
});

// #endregion
