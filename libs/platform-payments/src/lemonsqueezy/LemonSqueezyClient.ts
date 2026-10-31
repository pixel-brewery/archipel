// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { createCheckout, getSubscription, getVariant, lemonSqueezySetup, listPrices } from '@lemonsqueezy/lemonsqueezy.js';
import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PaymentClientBase } from '../abstracts/PaymentClientBase.js';
import { PaymentError } from '../errors/PaymentError.js';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET } from './env.js';
import { LemonSqueezyMapper } from './LemonSqueezyMapper.js';

// #endregion

/**
 * LemonSqueezy implementation of the {@link PaymentClientBase}.
 * Uses the official `@lemonsqueezy/lemonsqueezy.js` SDK.
 *
 * @public
 */
@Injectable()
export class LemonSqueezyClient extends PaymentClientBase {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(LemonSqueezyClient.name);
    private readonly _mapper: LemonSqueezyMapper = new LemonSqueezyMapper();

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();

        this._configService = configService;

        lemonSqueezySetup({
            apiKey: this._configService.get(LEMONSQUEEZY_API_KEY.key),
            onError: (error) => this._logger.error('[LemonSqueezyClient] SDK error', error),
        });
    }

    // #endregion

    // #region Methods

    /** @inheritDoc */
    public async fetchPrices(productId: string): Promise<Array<INormalizedPrice>> {
        try {
            const response = await listPrices({ filter: { variantId: productId } });

            if (response.error) {
                this._logger.error('[LemonSqueezyClient] fetchPrices API error', response.error);
                throw new PaymentError('lemonsqueezy', `fetchPrices API error: ${JSON.stringify(response.error)}`);
            }

            return (response.data?.data ?? []).map((price) => this._mapper.mapPrice(price, productId)).sort((a, b) => a.amount - b.amount);
        } catch (error: unknown) {
            this._logger.error('[LemonSqueezyClient] fetchPrices failed', {
                productId,
                error: (error as Error).message,
            });
            throw error;
        }
    }

    /** @inheritDoc */
    public async createCheckoutSession(priceId: string, successUrl: string, _cancelUrl: string, userId?: string): Promise<INormalizedCheckoutSession> {
        try {
            const storeId = this._configService.get(LEMONSQUEEZY_STORE_ID.key);

            const variant = await getVariant(priceId);
            if (variant.error || !variant.data) {
                throw new PaymentError('lemonsqueezy', `Variant ${priceId} not found`);
            }

            const checkout = await createCheckout(storeId, priceId, {
                checkoutData: {
                    custom: userId ? { user_id: userId } : undefined,
                },
                productOptions: {
                    redirectUrl: successUrl,
                },
            });

            if (checkout.error || !checkout.data) {
                throw new PaymentError('lemonsqueezy', 'Failed to create checkout');
            }

            return this._mapper.mapCheckoutSession(checkout.data.data, userId);
        } catch (error: unknown) {
            this._logger.error('[LemonSqueezyClient] createCheckoutSession failed', {
                priceId,
                userId,
                error: (error as Error).message,
            });
            throw new PaymentError('lemonsqueezy', 'Unable to create checkout session', error);
        }
    }

    /** @inheritDoc */
    public async fetchSubscription(subscriptionId: string): Promise<INormalizedSubscription | null> {
        try {
            const response = await getSubscription(subscriptionId);

            if (response.error || !response.data) {
                return null;
            }

            return this._mapper.mapSubscription(response.data.data);
        } catch (error: unknown) {
            this._logger.error('[LemonSqueezyClient] fetchSubscription failed', {
                subscriptionId,
                error: (error as Error).message,
            });
            return null;
        }
    }

    /** @inheritDoc */
    public constructWebhookEvent(payload: string | Buffer, signature: string): INormalizedWebhookEvent {
        const secret = this._configService.get(LEMONSQUEEZY_WEBHOOK_SECRET.key);
        const rawPayload = typeof payload === 'string' ? payload : payload.toString('utf-8');

        const hmac = createHmac('sha256', secret).update(rawPayload).digest('hex');

        const hmacBuffer = Buffer.from(hmac, 'utf-8');
        const signatureBuffer = Buffer.from(signature, 'utf-8');

        if (hmacBuffer.length !== signatureBuffer.length || !timingSafeEqual(hmacBuffer, signatureBuffer)) {
            throw new PaymentError('lemonsqueezy', 'Invalid webhook signature');
        }

        try {
            const event = JSON.parse(rawPayload) as { meta: { event_name: string }; data: Record<string, unknown> };
            return this._mapper.mapWebhookEvent(event);
        } catch (error: unknown) {
            this._logger.error('[LemonSqueezyClient] constructWebhookEvent failed', {
                error: (error as Error).message,
            });
            throw new PaymentError('lemonsqueezy', 'Invalid webhook payload', error);
        }
    }

    // #endregion
}
