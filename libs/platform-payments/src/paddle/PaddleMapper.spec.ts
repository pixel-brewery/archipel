import type { Subscription, Transaction } from '@paddle/paddle-node-sdk';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaddleMapper } from './PaddleMapper.js';

describe('PaddleMapper', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map an unrecognized transaction status to unknown', () => {
        // arrange
        const mapper = new PaddleMapper();
        const transaction = {
            id: 'txn_1',
            status: 'future_status',
            checkout: { url: null },
            subscriptionId: null,
            customerId: null,
            customData: null,
        } as unknown as Transaction;

        // act
        const checkoutSession = mapper.mapCheckoutSession(transaction);

        // assert
        expect(checkoutSession.paymentStatus).toBe('unknown');
    });

    it('should map an unrecognized subscription status to unknown', () => {
        // arrange
        const mapper = new PaddleMapper();
        const subscription = {
            id: 'sub_1',
            customerId: 'ctm_1',
            status: 'future_status',
            items: [],
            currentBillingPeriod: null,
            scheduledChange: null,
        } as unknown as Subscription;

        // act
        const normalizedSubscription = mapper.mapSubscription(subscription);

        // assert
        expect(normalizedSubscription.status).toBe('unknown');
    });
});
