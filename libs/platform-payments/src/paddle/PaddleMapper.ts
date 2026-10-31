// #region Imports

import { EventName, type Paddle, type Price, type Subscription, type Transaction } from '@paddle/paddle-node-sdk';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import type { SubscriptionStatus } from '../models/SubscriptionStatus.js';

// #endregion

interface IPaddleTrialPeriod {
    readonly startsAt: string;
    readonly endsAt: string;
}

/**
 * Maps Paddle SDK resources to Archipel's stable payment models.
 *
 * @internal
 */
export class PaddleMapper {
    // #region Methods

    /**
     * Maps a Paddle transaction to the stable checkout contract.
     *
     * @param transaction - Paddle transaction.
     * @param userId - Optional user reference supplied during checkout creation.
     * @returns Normalized checkout session.
     */
    public mapCheckoutSession(transaction: Transaction, userId?: string): INormalizedCheckoutSession {
        return {
            id: transaction.id,
            url: transaction.checkout?.url ?? null,
            subscriptionId: transaction.subscriptionId ?? null,
            customerId: transaction.customerId ?? null,
            clientReferenceId: userId ?? this.readUserId(transaction.customData),
            paymentStatus: this.mapPaymentStatus(transaction.status),
        };
    }

    /**
     * Maps a Paddle price to the stable price contract.
     *
     * @param price - Paddle price.
     * @returns Normalized price.
     */
    public mapPrice(price: Price): INormalizedPrice {
        const unitAmount = price.unitPrice?.amount ? parseInt(price.unitPrice.amount, 10) : 0;

        let interval: 'week' | 'month' | 'quarter' | 'year' | null = null;
        if (price.billingCycle?.interval === 'month' && price.billingCycle.frequency === 3) {
            interval = 'quarter';
        } else if (price.billingCycle?.interval === 'month') {
            interval = 'month';
        } else if (price.billingCycle?.interval === 'year') {
            interval = 'year';
        } else if (price.billingCycle?.interval === 'week') {
            interval = 'week';
        }

        return {
            id: price.id,
            productId: price.productId ?? '',
            amount: unitAmount,
            currency: price.unitPrice?.currencyCode ?? 'USD',
            interval,
            intervalCount: price.billingCycle?.frequency ?? 1,
            active: price.status === 'active',
        };
    }

    /**
     * Maps a Paddle subscription to the stable subscription contract.
     *
     * @param subscription - Paddle subscription.
     * @returns Normalized subscription.
     */
    public mapSubscription(subscription: Subscription): INormalizedSubscription {
        const trialPeriod = this.readTrialPeriod(subscription);

        return {
            id: subscription.id,
            customerId: subscription.customerId,
            status: this.mapSubscriptionStatus(subscription.status),
            priceId: subscription.items[0]?.price?.id ?? '',
            currentPeriodStart: new Date(subscription.currentBillingPeriod?.startsAt ?? Date.now()),
            currentPeriodEnd: new Date(subscription.currentBillingPeriod?.endsAt ?? Date.now()),
            cancelAtPeriodEnd: subscription.scheduledChange?.action === 'cancel',
            trialStart: trialPeriod ? new Date(trialPeriod.startsAt) : null,
            trialEnd: trialPeriod ? new Date(trialPeriod.endsAt) : null,
        };
    }

    /**
     * Maps a Paddle event to the stable webhook contract.
     *
     * @param eventData - Verified Paddle webhook event.
     * @returns Normalized webhook event.
     */
    public mapWebhookEvent(eventData: Awaited<ReturnType<Paddle['webhooks']['unmarshal']>>): INormalizedWebhookEvent {
        const type = this.mapEventType(eventData.eventType);
        let data: INormalizedWebhookEvent['data'] = {};

        if ((type === 'subscription.updated' || type === 'subscription.deleted') && eventData.data) {
            data = {
                subscription: this.mapSubscription(eventData.data as unknown as Subscription),
            };
        } else if (type === 'checkout.session.completed' && eventData.data) {
            data = {
                checkoutSession: this.mapCheckoutSession(eventData.data as unknown as Transaction),
            };
        }

        return {
            type,
            data,
        };
    }

    private mapEventType(type: string): INormalizedWebhookEvent['type'] {
        const typeMap: Record<string, INormalizedWebhookEvent['type']> = {
            [EventName.TransactionCompleted]: 'checkout.session.completed',
            [EventName.SubscriptionUpdated]: 'subscription.updated',
            [EventName.SubscriptionCanceled]: 'subscription.deleted',
        };

        return typeMap[type] ?? 'unknown';
    }

    private mapPaymentStatus(status: string): INormalizedCheckoutSession['paymentStatus'] {
        const statusMap: Record<string, INormalizedCheckoutSession['paymentStatus']> = {
            completed: 'paid',
            paid: 'paid',
            billed: 'unpaid',
            canceled: 'unpaid',
            draft: 'unpaid',
            past_due: 'unpaid',
            ready: 'unpaid',
        };

        return statusMap[status] ?? 'unknown';
    }

    private mapSubscriptionStatus(status: string): SubscriptionStatus {
        const statusMap: Record<string, SubscriptionStatus> = {
            active: 'active',
            canceled: 'canceled',
            past_due: 'pastDue',
            paused: 'paused',
            trialing: 'trialing',
        };

        return statusMap[status] ?? 'unknown';
    }

    private readTrialPeriod(subscription: Subscription): IPaddleTrialPeriod | null {
        const trialPeriod = (subscription as unknown as { readonly trialPeriod?: IPaddleTrialPeriod }).trialPeriod;
        return trialPeriod ?? null;
    }

    private readUserId(customData: Transaction['customData']): string | null {
        const userId = customData?.['userId'];
        return typeof userId === 'string' ? userId : null;
    }

    // #endregion
}
