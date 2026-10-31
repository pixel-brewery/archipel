// #region Imports

import type { Checkout, Price, Subscription } from '@lemonsqueezy/lemonsqueezy.js';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import type { SubscriptionStatus } from '../models/SubscriptionStatus.js';

// #endregion

interface ILemonSqueezyWebhookEvent {
    readonly meta: { readonly event_name: string };
    readonly data: Record<string, unknown>;
}

/**
 * Maps Lemon Squeezy SDK resources to Archipel's stable payment models.
 *
 * @internal
 */
export class LemonSqueezyMapper {
    // #region Methods

    /**
     * Maps a Lemon Squeezy checkout to the stable checkout contract.
     *
     * @param checkout - Lemon Squeezy checkout resource.
     * @param userId - Optional user reference supplied during checkout creation.
     * @returns Normalized checkout session.
     */
    public mapCheckoutSession(checkout: Checkout['data'], userId?: string): INormalizedCheckoutSession {
        return {
            id: checkout.id,
            url: checkout.attributes.url,
            subscriptionId: null,
            customerId: null,
            clientReferenceId: userId ?? null,
            paymentStatus: 'unpaid',
        };
    }

    /**
     * Maps a Lemon Squeezy price to the stable price contract.
     *
     * @param price - Lemon Squeezy price resource.
     * @param productId - Product identifier supplied for the price query.
     * @returns Normalized price.
     */
    public mapPrice(price: Price['data'], productId: string): INormalizedPrice {
        const attributes = price.attributes as unknown as Record<string, unknown>;
        const unitPrice = typeof attributes['unit_price'] === 'number' ? attributes['unit_price'] : 0;
        const billingInterval = typeof attributes['renewal_interval_unit'] === 'string' ? attributes['renewal_interval_unit'] : null;
        const billingFrequency = typeof attributes['renewal_interval_quantity'] === 'number' ? attributes['renewal_interval_quantity'] : 1;

        return {
            id: price.id,
            productId,
            amount: unitPrice,
            currency: typeof attributes['currency'] === 'string' ? attributes['currency'] : 'USD',
            interval: this.mapInterval(billingInterval, billingFrequency),
            intervalCount: billingFrequency,
            active: attributes['status'] === 'published',
        };
    }

    /**
     * Maps a Lemon Squeezy subscription to the stable subscription contract.
     *
     * @param subscription - Lemon Squeezy subscription resource.
     * @returns Normalized subscription.
     */
    public mapSubscription(subscription: Subscription['data']): INormalizedSubscription {
        const attributes = subscription.attributes;
        const createdAt = new Date(attributes.created_at);

        return {
            id: subscription.id,
            customerId: String(attributes.customer_id),
            status: this.mapSubscriptionStatus(attributes.status),
            priceId: String(attributes.variant_id),
            currentPeriodStart: new Date(attributes.updated_at),
            currentPeriodEnd: new Date(attributes.ends_at ?? attributes.renews_at),
            cancelAtPeriodEnd: attributes.cancelled,
            trialStart: attributes.trial_ends_at ? createdAt : null,
            trialEnd: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : null,
        };
    }

    /**
     * Maps a Lemon Squeezy event to the stable webhook contract.
     *
     * @param event - Verified Lemon Squeezy webhook event.
     * @returns Normalized webhook event.
     */
    public mapWebhookEvent(event: ILemonSqueezyWebhookEvent): INormalizedWebhookEvent {
        const typeMap: Record<string, INormalizedWebhookEvent['type']> = {
            subscription_created: 'checkout.session.completed',
            subscription_updated: 'subscription.updated',
            subscription_cancelled: 'subscription.deleted',
            subscription_payment_failed: 'invoice.payment_failed',
            subscription_payment_success: 'invoice.payment_succeeded',
        };

        return {
            type: typeMap[event.meta.event_name] ?? 'unknown',
            data: event.data,
        };
    }

    private mapInterval(interval: string | null, frequency: number): INormalizedPrice['interval'] {
        if (interval === 'month' && frequency === 3) {
            return 'quarter';
        }

        if (interval === 'week' || interval === 'month' || interval === 'year') {
            return interval;
        }

        return null;
    }

    private mapSubscriptionStatus(status: string): SubscriptionStatus {
        const statusMap: Record<string, SubscriptionStatus> = {
            active: 'active',
            cancelled: 'canceled',
            past_due: 'pastDue',
            paused: 'paused',
            on_trial: 'trialing',
            unpaid: 'unpaid',
            expired: 'canceled',
        };

        return statusMap[status] ?? 'unknown';
    }

    // #endregion
}
