// #region Imports

import { describe, expect, it } from 'vitest';
import { EsigningError } from './EsigningError.js';
import { SigningRequestNotFoundError } from './SigningRequestNotFoundError.js';

// #endregion

describe('SigningRequestNotFoundError', () => {
    // #region Methods

    describe('constructor', () => {
        it('should format the message with the signing request identifier', () => {
            // arrange & act
            const error = new SigningRequestNotFoundError('sr-abc-123');

            // assert
            expect(error.message).toBe("Signing request 'sr-abc-123' not found.");
        });

        it('should set the code to SIGNING_REQUEST_NOT_FOUND', () => {
            // arrange & act
            const error = new SigningRequestNotFoundError('sr-001');

            // assert
            expect(error.code).toBe('SIGNING_REQUEST_NOT_FOUND');
        });

        it('should set the name to SigningRequestNotFoundError', () => {
            // arrange & act
            const error = new SigningRequestNotFoundError('sr-001');

            // assert
            expect(error.name).toBe('SigningRequestNotFoundError');
        });

        it('should expose the signing request identifier', () => {
            // arrange & act
            const error = new SigningRequestNotFoundError('sr-xyz-789');

            // assert
            expect(error.signingRequestId).toBe('sr-xyz-789');
        });

        it('should be an instance of EsigningError', () => {
            // arrange & act
            const error = new SigningRequestNotFoundError('sr-001');

            // assert
            expect(error).toBeInstanceOf(EsigningError);
        });
    });

    // #endregion
});
