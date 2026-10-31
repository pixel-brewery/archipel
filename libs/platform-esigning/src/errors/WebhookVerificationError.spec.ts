// #region Imports

import { describe, expect, it } from 'vitest';
import { EsigningError } from './EsigningError.js';
import { WebhookVerificationError } from './WebhookVerificationError.js';

// #endregion

describe('WebhookVerificationError', () => {
    // #region Methods

    describe('constructor', () => {
        it('should use the default message when none is provided', () => {
            // arrange & act
            const error = new WebhookVerificationError();

            // assert
            expect(error.message).toBe('Webhook signature verification failed.');
        });

        it('should use the custom message when provided', () => {
            // arrange & act
            const error = new WebhookVerificationError('Invalid HMAC signature.');

            // assert
            expect(error.message).toBe('Invalid HMAC signature.');
        });

        it('should set the code to WEBHOOK_VERIFICATION_FAILED', () => {
            // arrange & act
            const error = new WebhookVerificationError();

            // assert
            expect(error.code).toBe('WEBHOOK_VERIFICATION_FAILED');
        });

        it('should set the name to WebhookVerificationError', () => {
            // arrange & act
            const error = new WebhookVerificationError();

            // assert
            expect(error.name).toBe('WebhookVerificationError');
        });

        it('should be an instance of EsigningError', () => {
            // arrange & act
            const error = new WebhookVerificationError();

            // assert
            expect(error).toBeInstanceOf(EsigningError);
        });
    });

    // #endregion
});
