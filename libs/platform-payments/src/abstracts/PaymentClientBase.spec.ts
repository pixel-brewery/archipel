// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { PaymentClientBase } from './PaymentClientBase.js';

// #endregion

// #region Tests

describe('PaymentClientBase', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have a default ping() that returns true', async () => {
        // arrange
        class TestClient extends PaymentClientBase {
            public fetchPrices = vi.fn();
            public createCheckoutSession = vi.fn();
            public fetchSubscription = vi.fn();
            public constructWebhookEvent = vi.fn();
        }
        const client = new TestClient();

        // act
        const result = await client.ping();

        // assert
        expect(result).toBe(true);
    });

    it('should define abstract method fetchPrices', () => {
        // arrange / act / assert
        expect(PaymentClientBase.prototype.fetchPrices).toBeUndefined();
    });

    it('should define abstract method createCheckoutSession', () => {
        // arrange / act / assert
        expect(PaymentClientBase.prototype.createCheckoutSession).toBeUndefined();
    });

    it('should define abstract method fetchSubscription', () => {
        // arrange / act / assert
        expect(PaymentClientBase.prototype.fetchSubscription).toBeUndefined();
    });

    it('should define abstract method constructWebhookEvent', () => {
        // arrange / act / assert
        expect(PaymentClientBase.prototype.constructWebhookEvent).toBeUndefined();
    });
});

// #endregion
