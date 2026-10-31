// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentClientBase } from '../abstracts/PaymentClientBase.js';
import { PaymentError } from '../errors/PaymentError.js';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import { STRIPE_API_KEY, STRIPE_WEBHOOK_SECRET } from './env.js';
import { StripeMapper } from './StripeMapper.js';

// #endregion

/**
 * Stripe implementation of the {@link PaymentClientBase}.
 * All Stripe-specific types and logic are encapsulated here.
 *
 * @public
 */
@Injectable()
export class StripeClient extends PaymentClientBase {
    // #region Fields

    private readonly _stripe: InstanceType<typeof Stripe>;
    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(StripeClient.name);
    private readonly _mapper: StripeMapper = new StripeMapper();

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();

        this._configService = configService;
        this._stripe = new Stripe(this._configService.get(STRIPE_API_KEY.key), {
            timeout: 3000,
            maxNetworkRetries: 2,
        });
    }

    // #endregion

    // #region Methods

    /**
     * Fetch all active prices for a product.
     *
     * @param productId External product identifier
     * @returns Array of normalized prices
     *
     * @public
     */
    public async fetchPrices(productId: string): Promise<Array<INormalizedPrice>> {
        try {
            const product = await this._stripe.products.retrieve(productId);
            const prices = await this._stripe.prices.list({
                product: product.id,
                active: true,
            });

            return prices.data.map((price) => this._mapper.mapPrice(price)).sort((a, b) => a.amount - b.amount);
        } catch (error: unknown) {
            this._logger.error('[StripeClient] fetchPrices failed', {
                productId,
                error: (error as Error).message,
            });
            throw error;
        }
    }

    /**
     * Create a checkout session.
     *
     * @param priceId Price identifier
     * @param successUrl Success redirect URL
     * @param cancelUrl Cancel redirect URL
     * @param userId Optional user reference
     * @returns Normalized checkout session
     *
     * @public
     */
    public async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, userId?: string): Promise<INormalizedCheckoutSession> {
        try {
            const session = await this._stripe.checkout.sessions.create({
                allowed_payment_method_types: ['card', 'paypal'],
                mode: 'subscription',
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: successUrl,
                cancel_url: cancelUrl,
                client_reference_id: userId,
            });

            return this._mapper.mapCheckoutSession(session);
        } catch (error: unknown) {
            this._logger.error('[StripeClient] createCheckoutSession failed', {
                priceId,
                userId,
                error: (error as Error).message,
            });
            throw new PaymentError('stripe', 'Unable to create checkout session', error);
        }
    }

    /**
     * Retrieve subscription details.
     *
     * @param subscriptionId Subscription identifier
     * @returns Normalized subscription
     *
     * @public
     */
    public async fetchSubscription(subscriptionId: string): Promise<INormalizedSubscription | null> {
        try {
            const subscription = await this._stripe.subscriptions.retrieve(subscriptionId, {
                expand: ['items.data.price'],
            });

            return this._mapper.mapSubscription(subscription);
        } catch (error: unknown) {
            this._logger.error('[StripeClient] fetchSubscription failed', {
                subscriptionId,
                error: (error as Error).message,
            });
            return null;
        }
    }

    /**
     * Construct and normalize a webhook event.
     *
     * @param payload Raw webhook body
     * @param signature Webhook signature header
     * @returns Normalized webhook event
     *
     * @public
     */
    public constructWebhookEvent(payload: string | Buffer, signature: string): INormalizedWebhookEvent {
        const webhookSecret = this._configService.get(STRIPE_WEBHOOK_SECRET.key);

        try {
            const event = this._stripe.webhooks.constructEvent(payload, signature, webhookSecret);

            return this._mapper.mapWebhookEvent(event);
        } catch (error: unknown) {
            this._logger.error('[StripeClient] constructWebhookEvent failed', {
                error: (error as Error).message,
            });
            throw new PaymentError('stripe', 'Invalid webhook signature', error);
        }
    }

    // #endregion
}
