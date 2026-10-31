// #region Imports

import { describe, expect, it } from 'vitest';

import { QueueError } from './QueueError.js';
import { QueueValidationError } from './QueueValidationError.js';

// #endregion

// #region Tests

describe('QueueValidationError', () => {
    it('should set the error message', () => {
        // arrange & act
        const error = new QueueValidationError('Queue name must not be empty.');

        // assert
        expect(error.message).toBe('Queue name must not be empty.');
    });

    it('should set the name to QueueValidationError', () => {
        // arrange & act
        const error = new QueueValidationError('invalid input');

        // assert
        expect(error.name).toBe('QueueValidationError');
    });

    it('should be an instance of QueueError', () => {
        // arrange & act
        const error = new QueueValidationError('invalid');

        // assert
        expect(error).toBeInstanceOf(QueueError);
    });

    it('should be an instance of Error', () => {
        // arrange & act
        const error = new QueueValidationError('invalid');

        // assert
        expect(error).toBeInstanceOf(Error);
    });

    it('should preserve the custom message', () => {
        // arrange
        const message = 'Queue job error message must not be empty.';

        // act
        const error = new QueueValidationError(message);

        // assert
        expect(error.message).toBe(message);
    });
});

// #endregion
