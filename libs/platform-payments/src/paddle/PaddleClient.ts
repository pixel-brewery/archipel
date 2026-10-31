// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import type { Price as PaddlePrice } from '@paddle/paddle-node-sdk';
import { Environment, Paddle } from '@paddle/paddle-node-sdk';
import { PaymentClientBase } from '../abstracts/PaymentClientBase.js';
import { PaymentError } from '../errors/PaymentError.js';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import { PADDLE_API_KEY, PADDLE_ENVIRONMENT, PADDLE_WEBHOOK_SECRET } from './env.js';
import { PaddleMapper } from './PaddleMapper.js';

// #endregion

/**
 * Paddle implementation of the {@link PaymentClientBase}.
 * Uses the official `@paddle/paddle-node-sdk` to interact with the Paddle Billing API.
 *
 * @public
 */
@Injectable()
export class PaddleClient extends PaymentClientBase {
    // #region Fields

    private readonly _paddle: Paddle;
    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(PaddleClient.name);
    private readonly _mapper: PaddleMapper = new PaddleMapper();

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();

        this._configService = configService;
        const environment = this._configService.get(PADDLE_ENVIRONMENT.key) === 'sandbox' ? Environment.sandbox : Environment.production;

        this._paddle = new Paddle(this._configService.get(PADDLE_API_KEY.key), {
            environment,
        });
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public async fetchPrices(productId: string): Promise<Array<INormalizedPrice>> {
        try {
            const prices: PaddlePrice[] = [];

            const priceCollection = this._paddle.prices.list({ productId: [productId], status: ['active'] });
            for await (const price of priceCollection) {
                prices.push(price);
            }

            return prices.map((price) => this._mapper.mapPrice(price)).sort((a, b) => a.amount - b.amount);
        } catch (error: unknown) {
            this._logger.error('[PaddleClient] fetchPrices failed', {
                productId,
                error: (error as Error).message,
            });
            throw error;
        }
    }

    /** @inheritDoc */
    public async createCheckoutSession(priceId: string, successUrl: string, _cancelUrl: string, userId?: string): Promise<INormalizedCheckoutSession> {
        try {
            const transaction = await this._paddle.transactions.create({
                items: [{ priceId, quantity: 1 }],
                checkout: {
                    url: successUrl,
                },
                ...(userId ? { customData: { userId } } : {}),
            });

            return this._mapper.mapCheckoutSession(transaction, userId);
        } catch (error: unknown) {
            this._logger.error('[PaddleClient] createCheckoutSession failed', {
                priceId,
                userId,
                error: (error as Error).message,
            });
            throw new PaymentError('paddle', 'Unable to create checkout session', error);
        }
    }

    /** @inheritDoc */
    public async fetchSubscription(subscriptionId: string): Promise<INormalizedSubscription | null> {
        try {
            const subscription = await this._paddle.subscriptions.get(subscriptionId);

            return this._mapper.mapSubscription(subscription);
        } catch (error: unknown) {
            this._logger.error('[PaddleClient] fetchSubscription failed', {
                subscriptionId,
                error: (error as Error).message,
            });
            return null;
        }
    }

    /** @inheritDoc */
    public async constructWebhookEvent(payload: string | Buffer, signature: string): Promise<INormalizedWebhookEvent> {
        const webhookSecret = this._configService.get(PADDLE_WEBHOOK_SECRET.key);

        try {
            const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf-8');
            const eventData = await this._paddle.webhooks.unmarshal(rawPayload, webhookSecret, signature);

            return this._mapper.mapWebhookEvent(eventData);
        } catch (error: unknown) {
            this._logger.error('[PaddleClient] constructWebhookEvent failed', {
                error: (error as Error).message,
            });
            throw new PaymentError('paddle', 'Invalid webhook signature', error);
        }
    }

    // #endregion
}
