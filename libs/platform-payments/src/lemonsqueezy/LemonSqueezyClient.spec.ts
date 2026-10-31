import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LemonSqueezyClient } from './LemonSqueezyClient.js';

// #region Mocks

vi.mock('@lemonsqueezy/lemonsqueezy.js', () => ({
    lemonSqueezySetup: vi.fn(),
    listPrices: vi.fn(),
    getVariant: vi.fn(),
    createCheckout: vi.fn(),
    getSubscription: vi.fn(),
}));

// Import mocked functions after vi.mock
import { createCheckout, getSubscription, getVariant, listPrices } from '@lemonsqueezy/lemonsqueezy.js';

// #endregion

describe('LemonSqueezyClient', () => {
    // #region Fields

    let client: LemonSqueezyClient;
    let configServiceMock: Partial<ConfigService>;
    const WEBHOOK_SECRET = 'test-webhook-secret';

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        configServiceMock = {
            get: vi.fn().mockImplementation((key: string) => {
                if (key === 'LEMONSQUEEZY_API_KEY') return 'test-api-key';
                if (key === 'LEMONSQUEEZY_WEBHOOK_SECRET') return WEBHOOK_SECRET;
                if (key === 'LEMONSQUEEZY_STORE_ID') return 'store-123';
                return '';
            }),
        };

        client = new LemonSqueezyClient(configServiceMock as ConfigService);
    });

    // #endregion

    // #region fetchPrices

    describe('fetchPrices', () => {
        it('should return normalized prices sorted by amount', async () => {
            // arrange
            vi.mocked(listPrices).mockResolvedValue({
                error: null,
                data: {
                    data: [
                        {
                            id: 'price-2',
                            attributes: {
                                unit_price: 2000,
                                currency: 'USD',
                                renewal_interval_unit: 'year',
                                renewal_interval_quantity: 1,
                                status: 'published',
                            },
                        },
                        {
                            id: 'price-1',
                            attributes: {
                                unit_price: 1000,
                                currency: 'USD',
                                renewal_interval_unit: 'month',
                                renewal_interval_quantity: 1,
                                status: 'published',
                            },
                        },
                    ],
                },
            } as never);

            // act
            const prices = await client.fetchPrices('product-123');

            // assert
            expect(prices).toHaveLength(2);
            expect(prices[0].id).toBe('price-1');
            expect(prices[0].amount).toBe(1000);
            expect(prices[0].interval).toBe('month');
            expect(prices[1].id).toBe('price-2');
            expect(prices[1].amount).toBe(2000);
            expect(prices[1].interval).toBe('year');
        });

        it('should map quarter interval when month count is 3', async () => {
            // arrange
            vi.mocked(listPrices).mockResolvedValue({
                error: null,
                data: {
                    data: [
                        {
                            id: 'price-q',
                            attributes: {
                                unit_price: 3000,
                                currency: 'EUR',
                                renewal_interval_unit: 'month',
                                renewal_interval_quantity: 3,
                                status: 'published',
                            },
                        },
                    ],
                },
            } as never);

            // act
            const prices = await client.fetchPrices('product-123');

            // assert
            expect(prices[0].interval).toBe('quarter');
            expect(prices[0].intervalCount).toBe(3);
        });

        it('should throw on API error', async () => {
            // arrange
            vi.mocked(listPrices).mockResolvedValue({
                error: { message: 'Unauthorized' },
                data: null,
            } as never);

            // act & assert
            await expect(client.fetchPrices('product-123')).rejects.toThrow('fetchPrices API error');
        });

        it('should throw on network error', async () => {
            // arrange
            vi.mocked(listPrices).mockRejectedValue(new Error('Network error'));

            // act & assert
            await expect(client.fetchPrices('product-123')).rejects.toThrow('Network error');
        });
    });

    // #endregion

    // #region createCheckoutSession

    describe('createCheckoutSession', () => {
        it('should create a checkout session', async () => {
            // arrange
            vi.mocked(getVariant).mockResolvedValue({
                error: null,
                data: { data: { id: 'variant-1' } },
            } as never);

            vi.mocked(createCheckout).mockResolvedValue({
                error: null,
                data: {
                    data: {
                        id: 'checkout-1',
                        attributes: { url: 'https://checkout.lemonsqueezy.com/abc' },
                    },
                },
            } as never);

            // act
            const session = await client.createCheckoutSession('variant-1', 'https://example.com/success', 'https://example.com/cancel', 'user-42');

            // assert
            expect(session.id).toBe('checkout-1');
            expect(session.url).toBe('https://checkout.lemonsqueezy.com/abc');
            expect(session.clientReferenceId).toBe('user-42');
            expect(session.paymentStatus).toBe('unpaid');
        });

        it('should throw when variant is not found', async () => {
            // arrange
            vi.mocked(getVariant).mockResolvedValue({
                error: { message: 'Not found' },
                data: null,
            } as never);

            // act & assert
            await expect(client.createCheckoutSession('bad-variant', 'https://example.com/success', 'https://example.com/cancel')).rejects.toThrow(
                'Unable to create checkout session',
            );
        });
    });

    // #endregion

    // #region fetchSubscription

    describe('fetchSubscription', () => {
        it('should return normalized subscription', async () => {
            // arrange
            vi.mocked(getSubscription).mockResolvedValue({
                error: null,
                data: {
                    data: {
                        id: 'sub-1',
                        attributes: {
                            customer_id: 'cust-1',
                            status: 'active',
                            variant_id: 'var-1',
                            renews_at: '2025-02-01T00:00:00Z',
                            ends_at: null,
                            cancelled: false,
                            trial_ends_at: null,
                            created_at: '2025-01-01T00:00:00Z',
                        },
                    },
                },
            } as never);

            // act
            const subscription = await client.fetchSubscription('sub-1');

            // assert
            expect(subscription).not.toBeNull();
            expect(subscription!.id).toBe('sub-1');
            expect(subscription!.customerId).toBe('cust-1');
            expect(subscription!.status).toBe('active');
            expect(subscription!.priceId).toBe('var-1');
            expect(subscription!.cancelAtPeriodEnd).toBe(false);
        });

        it('should map on_trial status to trialing', async () => {
            // arrange
            vi.mocked(getSubscription).mockResolvedValue({
                error: null,
                data: {
                    data: {
                        id: 'sub-2',
                        attributes: {
                            customer_id: 'cust-1',
                            status: 'on_trial',
                            variant_id: 'var-1',
                            renews_at: '2025-02-01T00:00:00Z',
                            ends_at: null,
                            cancelled: false,
                            trial_ends_at: '2025-01-15T00:00:00Z',
                            created_at: '2025-01-01T00:00:00Z',
                        },
                    },
                },
            } as never);

            // act
            const subscription = await client.fetchSubscription('sub-2');

            // assert
            expect(subscription!.status).toBe('trialing');
            expect(subscription!.trialEnd).toEqual(new Date('2025-01-15T00:00:00Z'));
        });

        it('should return null on API error', async () => {
            // arrange
            vi.mocked(getSubscription).mockResolvedValue({
                error: { message: 'Not found' },
                data: null,
            } as never);

            // act
            const subscription = await client.fetchSubscription('sub-bad');

            // assert
            expect(subscription).toBeNull();
        });

        it('should return null on thrown error', async () => {
            // arrange
            vi.mocked(getSubscription).mockRejectedValue(new Error('Network'));

            // act
            const subscription = await client.fetchSubscription('sub-bad');

            // assert
            expect(subscription).toBeNull();
        });
    });

    // #endregion

    // #region constructWebhookEvent

    describe('constructWebhookEvent', () => {
        it('should normalize subscription_created to checkout.session.completed', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_created' },
                data: { id: 'sub-1' },
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('checkout.session.completed');
        });

        it('should normalize subscription_updated to subscription.updated', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_updated' },
                data: { id: 'sub-1' },
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('subscription.updated');
        });

        it('should normalize subscription_cancelled to subscription.deleted', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_cancelled' },
                data: { id: 'sub-1' },
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('subscription.deleted');
        });

        it('should normalize subscription_payment_failed to invoice.payment_failed', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_payment_failed' },
                data: {},
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('invoice.payment_failed');
        });

        it('should normalize subscription_payment_success to invoice.payment_succeeded', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_payment_success' },
                data: {},
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('invoice.payment_succeeded');
        });

        it('should return unknown for unrecognized event types', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'order_created' },
                data: {},
            });
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');

            // act
            const event = client.constructWebhookEvent(payload, signature);

            // assert
            expect(event.type).toBe('unknown');
        });

        it('should throw on invalid signature', () => {
            // arrange
            const payload = JSON.stringify({
                meta: { event_name: 'subscription_created' },
                data: {},
            });

            // act & assert
            expect(() => client.constructWebhookEvent(payload, 'invalid-signature')).toThrow('Invalid webhook signature');
        });

        it('should accept Buffer payload', () => {
            // arrange
            const payloadStr = JSON.stringify({
                meta: { event_name: 'subscription_updated' },
                data: { id: 'sub-buf' },
            });
            const payloadBuf = Buffer.from(payloadStr, 'utf-8');
            const signature = createHmac('sha256', WEBHOOK_SECRET).update(payloadStr).digest('hex');

            // act
            const event = client.constructWebhookEvent(payloadBuf, signature);

            // assert
            expect(event.type).toBe('subscription.updated');
        });
    });

    // #endregion
});
