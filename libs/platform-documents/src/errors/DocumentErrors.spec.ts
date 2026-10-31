// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { DocumentRenderError } from './DocumentRenderError.js';
import { DocumentValidationError } from './DocumentValidationError.js';
import { ImageProcessingError } from './ImageProcessingError.js';

// #endregion

// #region Tests

describe('Document errors', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('DocumentRenderError', () => {
        it('should have the name "DocumentRenderError"', () => {
            // arrange / act
            const error = new DocumentRenderError('render failed');

            // assert
            expect(error.name).toBe('DocumentRenderError');
        });

        it('should have the code "DOCUMENT_RENDER"', () => {
            // arrange / act
            const error = new DocumentRenderError('render failed');

            // assert
            expect(error.code).toBe('DOCUMENT_RENDER');
        });

        it('should set the message', () => {
            // arrange / act
            const error = new DocumentRenderError('template missing');

            // assert
            expect(error.message).toBe('template missing');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new DocumentRenderError('fail');

            // assert
            expect(error).toBeInstanceOf(Error);
        });

        it('should pass through the cause', () => {
            // arrange
            const cause = new Error('root cause');

            // act
            const error = new DocumentRenderError('render failed', cause);

            // assert
            expect(error.cause).toBe(cause);
        });
    });

    describe('DocumentValidationError', () => {
        it('should have the name "DocumentValidationError"', () => {
            // arrange / act
            const error = new DocumentValidationError('invalid input');

            // assert
            expect(error.name).toBe('DocumentValidationError');
        });

        it('should have the code "DOCUMENT_VALIDATION"', () => {
            // arrange / act
            const error = new DocumentValidationError('invalid input');

            // assert
            expect(error.code).toBe('DOCUMENT_VALIDATION');
        });

        it('should set the message', () => {
            // arrange / act
            const error = new DocumentValidationError('missing field');

            // assert
            expect(error.message).toBe('missing field');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new DocumentValidationError('fail');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('ImageProcessingError', () => {
        it('should have the name "ImageProcessingError"', () => {
            // arrange / act
            const error = new ImageProcessingError('resize failed');

            // assert
            expect(error.name).toBe('ImageProcessingError');
        });

        it('should have the code "IMAGE_PROCESSING"', () => {
            // arrange / act
            const error = new ImageProcessingError('resize failed');

            // assert
            expect(error.code).toBe('IMAGE_PROCESSING');
        });

        it('should set the message', () => {
            // arrange / act
            const error = new ImageProcessingError('corrupt image');

            // assert
            expect(error.message).toBe('corrupt image');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new ImageProcessingError('fail');

            // assert
            expect(error).toBeInstanceOf(Error);
        });

        it('should pass through the cause', () => {
            // arrange
            const cause = new Error('sharp error');

            // act
            const error = new ImageProcessingError('processing failed', cause);

            // assert
            expect(error.cause).toBe(cause);
        });
    });
});

// #endregion
