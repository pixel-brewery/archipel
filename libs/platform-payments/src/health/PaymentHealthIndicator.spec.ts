// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentHealthIndicator } from './PaymentHealthIndicator.js';

// #endregion

// #region Tests

describe('PaymentHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have key "payment"', () => {
        // arrange
        const indicator = new PaymentHealthIndicator();

        // act / assert
        expect(indicator.key).toBe('payment');
    });

    it('should return disabled status when no client is configured', async () => {
        // arrange
        const indicator = new PaymentHealthIndicator();

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({ payment: { status: 'up', disabled: true } });
    });

    it('should return up when ping returns true', async () => {
        // arrange
        const client = { ping: vi.fn().mockResolvedValue(true) } as never;
        const indicator = new PaymentHealthIndicator(client);

        // act
        const result = await indicator.check();

        // assert
        expect(result.payment.status).toBe('up');
    });

    it('should return down when ping returns false', async () => {
        // arrange
        const client = { ping: vi.fn().mockResolvedValue(false) } as never;
        const indicator = new PaymentHealthIndicator(client);

        // act
        const result = await indicator.check();

        // assert
        expect(result.payment.status).toBe('down');
    });

    it('should return down with error message when ping throws', async () => {
        // arrange
        const client = { ping: vi.fn().mockRejectedValue(new Error('connection timeout')) } as never;
        const indicator = new PaymentHealthIndicator(client);

        // act
        const result = await indicator.check();

        // assert
        expect(result.payment.status).toBe('down');
        expect(result.payment.error).toBe('connection timeout');
    });
});

// #endregion
