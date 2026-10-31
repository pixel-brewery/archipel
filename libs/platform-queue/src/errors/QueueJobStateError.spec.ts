// #region Imports

import { describe, expect, it } from 'vitest';

import { QueueError } from './QueueError.js';
import { QueueJobStateError } from './QueueJobStateError.js';

// #endregion

// #region Tests

describe('QueueJobStateError', () => {
    it('should format the message with job ID, expected, and actual status', () => {
        // arrange & act
        const error = new QueueJobStateError('job-42', 'processing', 'pending');

        // assert
        expect(error.message).toBe("Queue job 'job-42' is in 'pending' status, expected 'processing'.");
    });

    it('should set the name to QueueJobStateError', () => {
        // arrange & act
        const error = new QueueJobStateError('job-1', 'processing', 'completed');

        // assert
        expect(error.name).toBe('QueueJobStateError');
    });

    it('should be an instance of QueueError', () => {
        // arrange & act
        const error = new QueueJobStateError('job-1', 'processing', 'completed');

        // assert
        expect(error).toBeInstanceOf(QueueError);
    });

    it('should be an instance of Error', () => {
        // arrange & act
        const error = new QueueJobStateError('job-1', 'processing', 'completed');

        // assert
        expect(error).toBeInstanceOf(Error);
    });

    it('should handle matching expected and actual status', () => {
        // arrange & act
        const error = new QueueJobStateError('job-1', 'pending', 'pending');

        // assert
        expect(error.message).toBe("Queue job 'job-1' is in 'pending' status, expected 'pending'.");
    });
});

// #endregion
