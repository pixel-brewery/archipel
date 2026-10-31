// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentError } from './PaymentError.js';

// #endregion

// #region Tests

describe('PaymentError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have code PAYMENT', () => {
        // arrange / act
        const error = new PaymentError('stripe', 'charge failed');

        // assert
        expect(error.code).toBe('PAYMENT');
    });

    it('should have name PaymentError', () => {
        // arrange / act
        const error = new PaymentError('stripe', 'charge failed');

        // assert
        expect(error.name).toBe('PaymentError');
    });

    it('should store the provider', () => {
        // arrange / act
        const error = new PaymentError('paddle', 'subscription failed');

        // assert
        expect(error.provider).toBe('paddle');
    });

    it('should store the message', () => {
        // arrange / act
        const error = new PaymentError('stripe', 'card declined');

        // assert
        expect(error.message).toBe('card declined');
    });

    it('should pass through cause', () => {
        // arrange
        const cause = new Error('original');

        // act
        const error = new PaymentError('stripe', 'failed', cause);

        // assert
        expect(error.cause).toBe(cause);
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new PaymentError('stripe', 'msg');

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
