// #region Imports

import { describe, expect, it } from 'vitest';

import type { QueueJobStatus } from './IQueueJob.js';
import { QUEUE_JOB_STATUS } from './IQueueJob.js';

// #endregion

// #region Tests

describe('QUEUE_JOB_STATUS', () => {
    it('should define a pending status', () => {
        // assert
        expect(QUEUE_JOB_STATUS.pending).toBe('pending');
    });

    it('should define a processing status', () => {
        // assert
        expect(QUEUE_JOB_STATUS.processing).toBe('processing');
    });

    it('should define a completed status', () => {
        // assert
        expect(QUEUE_JOB_STATUS.completed).toBe('completed');
    });

    it('should define a failed status', () => {
        // assert
        expect(QUEUE_JOB_STATUS.failed).toBe('failed');
    });

    it('should contain exactly four statuses', () => {
        // assert
        expect(Object.keys(QUEUE_JOB_STATUS)).toHaveLength(4);
    });

    it('should be assignable to QueueJobStatus type', () => {
        // arrange
        const status: QueueJobStatus = QUEUE_JOB_STATUS.pending;

        // assert
        expect(status).toBe('pending');
    });
});

// #endregion
