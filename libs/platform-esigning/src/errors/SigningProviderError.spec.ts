// #region Imports

import { describe, expect, it } from 'vitest';
import { EsigningError } from './EsigningError.js';
import { SigningProviderError } from './SigningProviderError.js';

// #endregion

describe('SigningProviderError', () => {
    // #region Methods

    describe('constructor', () => {
        it('should format the message with the provider identifier', () => {
            // arrange & act
            const error = new SigningProviderError('docusign', 'Token expired');

            // assert
            expect(error.message).toBe('[docusign] Token expired');
        });

        it('should set the code to SIGNING_PROVIDER_ERROR', () => {
            // arrange & act
            const error = new SigningProviderError('docusign', 'Fail');

            // assert
            expect(error.code).toBe('SIGNING_PROVIDER_ERROR');
        });

        it('should set the name to SigningProviderError', () => {
            // arrange & act
            const error = new SigningProviderError('docusign', 'Fail');

            // assert
            expect(error.name).toBe('SigningProviderError');
        });

        it('should expose the provider identifier', () => {
            // arrange & act
            const error = new SigningProviderError('adobe-sign', 'Timeout');

            // assert
            expect(error.providerId).toBe('adobe-sign');
        });

        it('should expose the root cause when provided', () => {
            // arrange
            const rootCause = new Error('Network timeout');

            // act
            const error = new SigningProviderError('docusign', 'Call failed', rootCause);

            // assert
            expect(error.rootCause).toBe(rootCause);
        });

        it('should return undefined root cause when not provided', () => {
            // arrange & act
            const error = new SigningProviderError('docusign', 'Fail');

            // assert
            expect(error.rootCause).toBeUndefined();
        });

        it('should be an instance of EsigningError', () => {
            // arrange & act
            const error = new SigningProviderError('docusign', 'Fail');

            // assert
            expect(error).toBeInstanceOf(EsigningError);
        });
    });

    // #endregion
});
