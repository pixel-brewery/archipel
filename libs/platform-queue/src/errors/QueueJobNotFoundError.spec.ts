// #region Imports

import { describe, expect, it } from 'vitest';

import { QueueError } from './QueueError.js';
import { QueueJobNotFoundError } from './QueueJobNotFoundError.js';

// #endregion

// #region Tests

describe('QueueJobNotFoundError', () => {
    it('should format the message with the given job ID', () => {
        // arrange & act
        const error = new QueueJobNotFoundError('abc-123');

        // assert
        expect(error.message).toBe("Queue job 'abc-123' was not found.");
    });

    it('should set the name to QueueJobNotFoundError', () => {
        // arrange & act
        const error = new QueueJobNotFoundError('job-1');

        // assert
        expect(error.name).toBe('QueueJobNotFoundError');
    });

    it('should be an instance of QueueError', () => {
        // arrange & act
        const error = new QueueJobNotFoundError('job-1');

        // assert
        expect(error).toBeInstanceOf(QueueError);
    });

    it('should be an instance of Error', () => {
        // arrange & act
        const error = new QueueJobNotFoundError('job-1');

        // assert
        expect(error).toBeInstanceOf(Error);
    });

    it('should handle an empty job ID', () => {
        // arrange & act
        const error = new QueueJobNotFoundError('');

        // assert
        expect(error.message).toBe("Queue job '' was not found.");
    });
});

// #endregion
