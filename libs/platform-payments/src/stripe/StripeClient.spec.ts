import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StripeClient } from './StripeClient.js';

// #region Mocks

const mockProductsRetrieve = vi.fn();
const mockPricesList = vi.fn();
const mockCheckoutSessionsCreate = vi.fn();
const mockSubscriptionsRetrieve = vi.fn();
const mockWebhooksConstructEvent = vi.fn();

vi.mock('stripe', () => {
    const StripeMock = function () {
        return {
            products: { retrieve: mockProductsRetrieve },
            prices: { list: mockPricesList },
            checkout: { sessions: { create: mockCheckoutSessionsCreate } },
            subscriptions: { retrieve: mockSubscriptionsRetrieve },
            webhooks: { constructEvent: mockWebhooksConstructEvent },
        };
    };
    return { default: StripeMock };
});

// #endregion

describe('StripeClient', () => {
    // #region Fields

    let client: StripeClient;
    let configServiceMock: Partial<ConfigService>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        configServiceMock = {
            get: vi.fn().mockImplementation((key: string) => {
                if (key === 'STRIPE_API_KEY') return 'sk_test_123';
                if (key === 'STRIPE_WEBHOOK_SECRET') return 'whsec_test';
                return '';
            }),
        };

        client = new StripeClient(configServiceMock as ConfigService);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // #endregion

    // #region fetchPrices

    describe('fetchPrices', () => {
        it('should return normalized prices sorted by amount', async () => {
            // arrange
            mockProductsRetrieve.mockResolvedValue({ id: 'prod_1' });
            mockPricesList.mockResolvedValue({
                data: [
                    {
                        id: 'price_2',
                        product: 'prod_1',
                        unit_amount: 2000,
                        currency: 'usd',
                        active: true,
                        recurring: { interval: 'year', interval_count: 1 },
                    },
                    {
                        id: 'price_1',
                        product: 'prod_1',
                        unit_amount: 1000,
                        currency: 'usd',
                        active: true,
                        recurring: { interval: 'month', interval_count: 1 },
                    },
                ],
            });

            // act
            const prices = await client.fetchPrices('prod_1');

            // assert
            expect(prices).toHaveLength(2);
            expect(prices[0].id).toBe('price_1');
            expect(prices[0].amount).toBe(1000);
            expect(prices[0].interval).toBe('month');
            expect(prices[1].id).toBe('price_2');
            expect(prices[1].amount).toBe(2000);
            expect(prices[1].interval).toBe('year');
        });

        it('should map quarter interval when month count is 3', async () => {
            // arrange
            mockProductsRetrieve.mockResolvedValue({ id: 'prod_1' });
            mockPricesList.mockResolvedValue({
                data: [
                    {
                        id: 'price_q',
                        product: 'prod_1',
                        unit_amount: 3000,
                        currency: 'usd',
                        active: true,
                        recurring: { interval: 'month', interval_count: 3 },
                    },
                ],
            });

            // act
            const prices = await client.fetchPrices('prod_1');

            // assert
            expect(prices[0].interval).toBe('quarter');
        });

        it('should throw on error', async () => {
            // arrange
            mockProductsRetrieve.mockRejectedValue(new Error('Not found'));

            // act & assert
            await expect(client.fetchPrices('prod_bad')).rejects.toThrow('Not found');
        });
    });

    // #endregion

    // #region createCheckoutSession

    describe('createCheckoutSession', () => {
        it('should create and normalize a checkout session', async () => {
            // arrange
            mockCheckoutSessionsCreate.mockResolvedValue({
                id: 'cs_1',
                url: 'https://checkout.stripe.com/session/cs_1',
                subscription: 'sub_1',
                customer: 'cus_1',
                client_reference_id: 'user-42',
                payment_status: 'unpaid',
            });

            // act
            const session = await client.createCheckoutSession('price_1', 'https://example.com/success', 'https://example.com/cancel', 'user-42');

            // assert
            expect(mockCheckoutSessionsCreate).toHaveBeenCalledWith({
                allowed_payment_method_types: ['card', 'paypal'],
                mode: 'subscription',
                line_items: [{ price: 'price_1', quantity: 1 }],
                success_url: 'https://example.com/success',
                cancel_url: 'https://example.com/cancel',
                client_reference_id: 'user-42',
            });
            expect(session.id).toBe('cs_1');
            expect(session.url).toBe('https://checkout.stripe.com/session/cs_1');
            expect(session.subscriptionId).toBe('sub_1');
            expect(session.customerId).toBe('cus_1');
            expect(session.clientReferenceId).toBe('user-42');
            expect(session.paymentStatus).toBe('unpaid');
        });

        it('should throw on Stripe error', async () => {
            // arrange
            mockCheckoutSessionsCreate.mockRejectedValue(new Error('Invalid price'));

            // act & assert
            await expect(client.createCheckoutSession('bad_price', 'https://example.com/success', 'https://example.com/cancel')).rejects.toThrow(
                'Unable to create checkout session',
            );
        });

        it('should map an unrecognized Stripe payment status to unknown', async () => {
            // arrange
            mockCheckoutSessionsCreate.mockResolvedValue({
                id: 'cs_1',
                url: null,
                subscription: null,
                customer: null,
                client_reference_id: null,
                payment_status: 'future_status',
            });

            // act
            const session = await client.createCheckoutSession('price_1', 'https://example.com/success', 'https://example.com/cancel');

            // assert
            expect(session.paymentStatus).toBe('unknown');
        });

        it('should map Stripe no_payment_required to the provider-independent status', async () => {
            // arrange
            mockCheckoutSessionsCreate.mockResolvedValue({
                id: 'cs_1',
                url: null,
                subscription: null,
                customer: null,
                client_reference_id: null,
                payment_status: 'no_payment_required',
            });

            // act
            const session = await client.createCheckoutSession('price_1', 'https://example.com/success', 'https://example.com/cancel');

            // assert
            expect(session.paymentStatus).toBe('noPaymentRequired');
        });
    });

    // #endregion

    // #region fetchSubscription

    describe('fetchSubscription', () => {
        it('should return normalized subscription with all fields', async () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockSubscriptionsRetrieve.mockResolvedValue({
                id: 'sub_1',
                customer: 'cus_1',
                status: 'active',
                current_period_start: now,
                current_period_end: now + 30 * 86400,
                cancel_at_period_end: false,
                trial_start: null,
                trial_end: null,
                items: { data: [{ price: { id: 'price_1' } }] },
            });

            // act
            const subscription = await client.fetchSubscription('sub_1');

            // assert
            expect(subscription).not.toBeNull();
            expect(subscription!.id).toBe('sub_1');
            expect(subscription!.status).toBe('active');
            expect(subscription!.priceId).toBe('price_1');
            expect(subscription!.cancelAtPeriodEnd).toBe(false);
            expect(subscription!.trialStart).toBeNull();
        });

        it('should map trialing status', async () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockSubscriptionsRetrieve.mockResolvedValue({
                id: 'sub_2',
                customer: 'cus_1',
                status: 'trialing',
                current_period_start: now,
                current_period_end: now + 14 * 86400,
                cancel_at_period_end: false,
                trial_start: now,
                trial_end: now + 14 * 86400,
                items: { data: [{ price: { id: 'price_1' } }] },
            });

            // act
            const subscription = await client.fetchSubscription('sub_2');

            // assert
            expect(subscription!.status).toBe('trialing');
            expect(subscription!.trialStart).toBeInstanceOf(Date);
            expect(subscription!.trialEnd).toBeInstanceOf(Date);
        });

        it('should map past_due status to pastDue', async () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockSubscriptionsRetrieve.mockResolvedValue({
                id: 'sub_3',
                customer: 'cus_1',
                status: 'past_due',
                current_period_start: now,
                current_period_end: now + 30 * 86400,
                cancel_at_period_end: false,
                trial_start: null,
                trial_end: null,
                items: { data: [{ price: { id: 'price_1' } }] },
            });

            // act
            const subscription = await client.fetchSubscription('sub_3');

            // assert
            expect(subscription!.status).toBe('pastDue');
        });

        it('should map incomplete_expired status to incompleteExpired', async () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockSubscriptionsRetrieve.mockResolvedValue({
                id: 'sub_4',
                customer: 'cus_1',
                status: 'incomplete_expired',
                current_period_start: now,
                current_period_end: now + 30 * 86400,
                cancel_at_period_end: false,
                trial_start: null,
                trial_end: null,
                items: { data: [{ price: { id: 'price_1' } }] },
            });

            // act
            const subscription = await client.fetchSubscription('sub_4');

            // assert
            expect(subscription!.status).toBe('incompleteExpired');
        });

        it('should map an unrecognized Stripe subscription status to unknown', async () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockSubscriptionsRetrieve.mockResolvedValue({
                id: 'sub_5',
                customer: 'cus_1',
                status: 'future_status',
                current_period_start: now,
                current_period_end: now + 30 * 86400,
                cancel_at_period_end: false,
                trial_start: null,
                trial_end: null,
                items: { data: [{ price: { id: 'price_1' } }] },
            });

            // act
            const subscription = await client.fetchSubscription('sub_5');

            // assert
            expect(subscription?.status).toBe('unknown');
        });

        it('should return null on error', async () => {
            // arrange
            mockSubscriptionsRetrieve.mockRejectedValue(new Error('Not found'));

            // act
            const subscription = await client.fetchSubscription('sub_bad');

            // assert
            expect(subscription).toBeNull();
        });
    });

    // #endregion

    // #region constructWebhookEvent

    describe('constructWebhookEvent', () => {
        it('should normalize checkout.session.completed event', () => {
            // arrange
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'checkout.session.completed',
                data: {
                    object: {
                        id: 'cs_1',
                        url: null,
                        subscription: 'sub_1',
                        customer: 'cus_1',
                        client_reference_id: 'user-42',
                        payment_status: 'paid',
                    },
                },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.type).toBe('checkout.session.completed');
            expect(event.data.checkoutSession).toBeDefined();
            expect(event.data.checkoutSession!.id).toBe('cs_1');
        });

        it('should normalize customer.subscription.updated to subscription.updated', () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'customer.subscription.updated',
                data: {
                    object: {
                        id: 'sub_1',
                        customer: 'cus_1',
                        status: 'active',
                        current_period_start: now,
                        current_period_end: now + 30 * 86400,
                        cancel_at_period_end: false,
                        trial_start: null,
                        trial_end: null,
                        items: { data: [{ price: { id: 'price_1' } }] },
                    },
                },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.type).toBe('subscription.updated');
            expect(event.data.subscription).toBeDefined();
            expect(event.data.subscription!.id).toBe('sub_1');
        });

        it('should normalize customer.subscription.deleted to subscription.deleted', () => {
            // arrange
            const now = Math.floor(Date.now() / 1000);
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'customer.subscription.deleted',
                data: {
                    object: {
                        id: 'sub_1',
                        customer: 'cus_1',
                        status: 'canceled',
                        current_period_start: now,
                        current_period_end: now + 30 * 86400,
                        cancel_at_period_end: true,
                        trial_start: null,
                        trial_end: null,
                        items: { data: [{ price: { id: 'price_1' } }] },
                    },
                },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.type).toBe('subscription.deleted');
            expect(event.data.subscription!.status).toBe('canceled');
        });

        it('should normalize invoice.payment_failed event', () => {
            // arrange
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'invoice.payment_failed',
                data: {
                    object: {
                        id: 'in_1',
                        subscription: 'sub_1',
                        status: 'open',
                    },
                },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.type).toBe('invoice.payment_failed');
            expect(event.data.invoice).toBeDefined();
            expect(event.data.invoice!.id).toBe('in_1');
            expect(event.data.invoice!.subscriptionId).toBe('sub_1');
            expect(event.data.invoice!.status).toBe('open');
        });

        it('should map an unrecognized Stripe invoice status to unknown', () => {
            // arrange
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'invoice.payment_failed',
                data: {
                    object: {
                        id: 'in_1',
                        subscription: 'sub_1',
                        status: 'future_status',
                    },
                },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.data.invoice?.status).toBe('unknown');
        });

        it('should return unknown for unrecognized event types', () => {
            // arrange
            mockWebhooksConstructEvent.mockReturnValue({
                type: 'payment_intent.succeeded',
                data: { object: {} },
            });

            // act
            const event = client.constructWebhookEvent('payload', 'sig');

            // assert
            expect(event.type).toBe('unknown');
        });

        it('should throw on invalid signature', () => {
            // arrange
            mockWebhooksConstructEvent.mockImplementation(() => {
                throw new Error('Signature verification failed');
            });

            // act & assert
            expect(() => client.constructWebhookEvent('payload', 'bad-sig')).toThrow('Invalid webhook signature');
        });
    });

    // #endregion
});
