// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ReportingDatasetNotFoundError } from './ReportingDatasetNotFoundError.js';
import { ReportingExecutionError } from './ReportingExecutionError.js';
import { ReportingQueryValidationError } from './ReportingQueryValidationError.js';

// #endregion

// #region Tests

describe('ReportingErrors', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('ReportingDatasetNotFoundError', () => {
        it('should include datasetId in the message', () => {
            // arrange / act
            const error = new ReportingDatasetNotFoundError('ds-42');

            // assert
            expect(error.message).toContain('ds-42');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new ReportingDatasetNotFoundError('ds-1');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('ReportingQueryValidationError', () => {
        it('should include datasetId and invalidFields in the message', () => {
            // arrange / act
            const error = new ReportingQueryValidationError('ds-99', ['foo', 'bar']);

            // assert
            expect(error.message).toContain('ds-99');
            expect(error.message).toContain('foo');
            expect(error.message).toContain('bar');
        });

        it('should expose invalidFields property', () => {
            // arrange / act
            const error = new ReportingQueryValidationError('ds-1', ['field1', 'field2']);

            // assert
            expect(error.invalidFields).toEqual(['field1', 'field2']);
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new ReportingQueryValidationError('ds-1', []);

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('ReportingExecutionError', () => {
        it('should include datasetId in the message', () => {
            // arrange / act
            const error = new ReportingExecutionError('ds-5', new Error('db timeout'));

            // assert
            expect(error.message).toContain('ds-5');
            expect(error.message).toContain('db timeout');
        });

        it('should expose datasetId property', () => {
            // arrange / act
            const error = new ReportingExecutionError('ds-5', 'some error');

            // assert
            expect(error.datasetId).toBe('ds-5');
        });

        it('should store cause', () => {
            // arrange
            const cause = new Error('original');

            // act
            const error = new ReportingExecutionError('ds-5', cause);

            // assert
            expect(error.cause).toBe(cause);
        });

        it('should handle string cause', () => {
            // arrange / act
            const error = new ReportingExecutionError('ds-5', 'string error');

            // assert
            expect(error.message).toContain('string error');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new ReportingExecutionError('ds-1', 'fail');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });
});

// #endregion
