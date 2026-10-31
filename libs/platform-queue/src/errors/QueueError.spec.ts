// #region Imports

import { describe, expect, it } from 'vitest';

import { QueueError } from './QueueError.js';

// #endregion

// #region Tests

describe('QueueError', () => {
    it('should set the error message', () => {
        // arrange & act
        const error = new QueueError('something went wrong');

        // assert
        expect(error.message).toBe('something went wrong');
    });

    it('should set the name to QueueError', () => {
        // arrange & act
        const error = new QueueError('fail');

        // assert
        expect(error.name).toBe('QueueError');
    });

    it('should be an instance of Error', () => {
        // arrange & act
        const error = new QueueError('fail');

        // assert
        expect(error).toBeInstanceOf(Error);
    });

    it('should be an instance of QueueError', () => {
        // arrange & act
        const error = new QueueError('fail');

        // assert
        expect(error).toBeInstanceOf(QueueError);
    });

    it('should include a stack trace', () => {
        // arrange & act
        const error = new QueueError('fail');

        // assert
        expect(error.stack).toBeDefined();
    });
});

// #endregion
