import type { Payment, Subscription } from '@mollie/api-client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MollieMapper } from './MollieMapper.js';

describe('MollieMapper', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map an unrecognized payment status to unknown', () => {
        // arrange
        const mapper = new MollieMapper();
        const payment = {
            id: 'tr_1',
            status: 'future_status',
            customerId: null,
            getCheckoutUrl: vi.fn().mockReturnValue(null),
        } as unknown as Payment;

        // act
        const checkoutSession = mapper.mapCheckoutSession(payment);

        // assert
        expect(checkoutSession.paymentStatus).toBe('unknown');
    });

    it('should map an unrecognized subscription status to unknown', () => {
        // arrange
        const mapper = new MollieMapper();
        const subscription = {
            id: 'sub_1',
            customerId: 'cst_1',
            status: 'future_status',
            description: 'Plan',
            amount: { currency: 'EUR', value: '10.00' },
            startDate: '2026-01-01',
        } as unknown as Subscription;

        // act
        const normalizedSubscription = mapper.mapSubscription(subscription);

        // assert
        expect(normalizedSubscription.status).toBe('unknown');
    });
});
