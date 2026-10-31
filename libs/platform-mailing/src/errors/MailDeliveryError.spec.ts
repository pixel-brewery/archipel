// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailDeliveryError } from './MailDeliveryError.js';

// #endregion

// #region Tests

describe('MailDeliveryError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should set name to MailDeliveryError', () => {
        // arrange / act
        const error = new MailDeliveryError('smtp', 'delivery failed');

        // assert
        expect(error.name).toBe('MailDeliveryError');
    });

    it('should set code to MAIL_DELIVERY', () => {
        // arrange / act
        const error = new MailDeliveryError('sendgrid', 'delivery failed');

        // assert
        expect(error.code).toBe('MAIL_DELIVERY');
    });

    it('should store the provider', () => {
        // arrange / act
        const error = new MailDeliveryError('postmark', 'delivery failed');

        // assert
        expect(error.provider).toBe('postmark');
    });

    it('should set message from constructor', () => {
        // arrange / act
        const error = new MailDeliveryError('resend', 'API rate limit exceeded');

        // assert
        expect(error.message).toBe('API rate limit exceeded');
    });

    it('should set cause when provided', () => {
        // arrange
        const cause = new Error('upstream');

        // act
        const error = new MailDeliveryError('mailgun', 'delivery failed', cause);

        // assert
        expect(error.cause).toBe(cause);
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new MailDeliveryError('smtp', 'test');

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
