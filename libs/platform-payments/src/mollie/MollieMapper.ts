// #region Imports

import type { Payment, Subscription } from '@mollie/api-client';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import type { SubscriptionStatus } from '../models/SubscriptionStatus.js';

// #endregion

/**
 * Maps Mollie SDK resources to Archipel's stable payment models.
 *
 * @internal
 */
export class MollieMapper {
    // #region Methods

    /**
     * Maps a Mollie payment to the stable checkout contract.
     *
     * @param payment - Mollie payment.
     * @param userId - Optional user reference supplied during payment creation.
     * @returns Normalized checkout session.
     */
    public mapCheckoutSession(payment: Payment, userId?: string): INormalizedCheckoutSession {
        return {
            id: payment.id,
            url: payment.getCheckoutUrl() ?? null,
            subscriptionId: null,
            customerId: payment.customerId ?? null,
            clientReferenceId: userId ?? null,
            paymentStatus: this.mapPaymentStatus(payment.status),
        };
    }

    /**
     * Maps a Mollie subscription to the stable subscription contract.
     *
     * @param subscription - Mollie subscription.
     * @returns Normalized subscription.
     */
    public mapSubscription(subscription: Subscription): INormalizedSubscription {
        return {
            id: subscription.id,
            customerId: subscription.customerId,
            status: this.mapSubscriptionStatus(subscription.status),
            priceId: subscription.description || `${subscription.amount.currency}_${subscription.amount.value}`,
            currentPeriodStart: new Date(subscription.startDate),
            currentPeriodEnd: new Date(subscription.nextPaymentDate ?? subscription.startDate),
            cancelAtPeriodEnd: Boolean(subscription.canceledAt),
            trialStart: null,
            trialEnd: null,
        };
    }

    /**
     * Maps a Mollie webhook payload to the stable webhook contract.
     *
     * @param event - Verified Mollie webhook payload.
     * @returns Normalized webhook event.
     */
    public mapWebhookEvent(event: Record<string, unknown>): INormalizedWebhookEvent {
        const resource = typeof event['resource'] === 'string' ? event['resource'] : 'unknown';
        const type = this.isNormalizedEventType(resource) ? resource : 'unknown';

        return {
            type,
            data: event,
        };
    }

    private isNormalizedEventType(type: string): type is INormalizedWebhookEvent['type'] {
        return [
            'checkout.session.completed',
            'subscription.updated',
            'subscription.deleted',
            'invoice.payment_failed',
            'invoice.payment_succeeded',
            'unknown',
        ].includes(type);
    }

    private mapPaymentStatus(status: string): INormalizedCheckoutSession['paymentStatus'] {
        const statusMap: Record<string, INormalizedCheckoutSession['paymentStatus']> = {
            authorized: 'unpaid',
            canceled: 'unpaid',
            expired: 'unpaid',
            failed: 'unpaid',
            open: 'unpaid',
            paid: 'paid',
            pending: 'unpaid',
        };

        return statusMap[status] ?? 'unknown';
    }

    private mapSubscriptionStatus(status: string): SubscriptionStatus {
        const statusMap: Record<string, SubscriptionStatus> = {
            active: 'active',
            pending: 'incomplete',
            canceled: 'canceled',
            suspended: 'pastDue',
            completed: 'canceled',
        };

        return statusMap[status] ?? 'unknown';
    }

    // #endregion
}
