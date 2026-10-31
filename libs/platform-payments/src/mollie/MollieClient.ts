// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { createMollieClient, type MollieClient as MollieApiClient } from '@mollie/api-client';
import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PaymentClientBase } from '../abstracts/PaymentClientBase.js';
import { PaymentError } from '../errors/PaymentError.js';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import { MOLLIE_API_KEY, MOLLIE_WEBHOOK_SECRET } from './env.js';
import { MollieMapper } from './MollieMapper.js';

// #endregion

/**
 * Mollie implementation of the {@link PaymentClientBase}.
 * Uses the official `@mollie/api-client` to interact with the Mollie API.
 *
 * @public
 */
@Injectable()
export class MollieClient extends PaymentClientBase {
    // #region Fields

    private readonly _mollie: MollieApiClient;
    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(MollieClient.name);
    private readonly _mapper: MollieMapper = new MollieMapper();

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();

        this._configService = configService;
        this._mollie = createMollieClient({
            apiKey: this._configService.get(MOLLIE_API_KEY.key),
        });
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public async fetchPrices(_productId: string): Promise<Array<INormalizedPrice>> {
        // Mollie does not have a native "prices" or "plans" concept like Stripe/Paddle.
        // Prices are typically embedded in the payment creation flow.
        // This is a placeholder - consumers should maintain a local price catalog.
        this._logger.warn('[MollieClient] fetchPrices is not natively supported. Mollie does not have a price catalog API.');
        return [];
    }

    /**
     * Creates a checkout session for Mollie.
     *
     * @remarks Mollie does not have a price catalog, so `priceId` is interpreted as a
     * formatted monetary amount (e.g. "10.00") for the payment creation.
     */
    public async createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, userId?: string): Promise<INormalizedCheckoutSession> {
        if (!/^\d+\.\d{2}$/.test(priceId)) {
            throw new PaymentError('mollie', `priceId must be a formatted amount (e.g. "10.00"), got "${priceId}"`);
        }

        try {
            const payment = await this._mollie.payments.create({
                amount: {
                    value: priceId,
                    currency: 'EUR',
                },
                description: 'Subscription payment',
                redirectUrl: successUrl,
                cancelUrl,
                metadata: userId ? { userId } : undefined,
            });

            return this._mapper.mapCheckoutSession(payment, userId);
        } catch (error: unknown) {
            this._logger.error('[MollieClient] createCheckoutSession failed', {
                priceId,
                userId,
                error: (error as Error).message,
            });
            throw new PaymentError('mollie', 'Unable to create checkout session', error);
        }
    }

    /** @inheritDoc */
    public async fetchSubscription(subscriptionId: string): Promise<INormalizedSubscription | null> {
        try {
            // Mollie subscriptions require a customerId - for this abstract base, we expect subscriptionId
            // to be formatted as "customerId:subscriptionId" or we retrieve via iteration.
            const parts = subscriptionId.split(':');
            if (parts.length !== 2) {
                this._logger.warn('[MollieClient] fetchSubscription expects "customerId:subscriptionId" format.');
                return null;
            }

            const [customerId, subId] = parts;
            const subscription = await this._mollie.customerSubscriptions.get(subId, {
                customerId,
            });

            return this._mapper.mapSubscription(subscription);
        } catch (error: unknown) {
            this._logger.error('[MollieClient] fetchSubscription failed', {
                subscriptionId,
                error: (error as Error).message,
            });
            return null;
        }
    }

    /** @inheritDoc */
    public constructWebhookEvent(payload: string | Buffer, signature: string): INormalizedWebhookEvent {
        const secret = this._configService.get(MOLLIE_WEBHOOK_SECRET.key);

        if (!secret) {
            throw new PaymentError('mollie', 'Webhook secret is not configured. Set MOLLIE_WEBHOOK_SECRET to verify webhooks.');
        }

        {
            const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf-8');
            const hmac = createHmac('sha256', secret).update(rawPayload).digest('hex');

            const hmacBuffer = Buffer.from(hmac, 'utf-8');
            const signatureBuffer = Buffer.from(signature, 'utf-8');

            if (hmacBuffer.length !== signatureBuffer.length || !timingSafeEqual(hmacBuffer, signatureBuffer)) {
                throw new PaymentError('mollie', 'Invalid webhook signature');
            }
        }

        try {
            const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf-8');
            const event = JSON.parse(rawPayload) as Record<string, unknown>;
            return this._mapper.mapWebhookEvent(event);
        } catch (error: unknown) {
            this._logger.error('[MollieClient] constructWebhookEvent failed', {
                error: (error as Error).message,
            });
            throw new PaymentError('mollie', 'Invalid webhook payload', error);
        }
    }

    // #endregion
}
