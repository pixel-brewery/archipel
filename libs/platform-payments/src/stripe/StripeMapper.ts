// #region Imports

import type Stripe from 'stripe';
import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';
import type { SubscriptionStatus } from '../models/SubscriptionStatus.js';

// #endregion

interface IStripeSubscriptionProjection {
    readonly id: string;
    readonly customer: string;
    readonly status: Stripe.Subscription.Status;
    readonly current_period_start: number;
    readonly current_period_end: number;
    readonly cancel_at_period_end: boolean;
    readonly trial_start: number | null;
    readonly trial_end: number | null;
    readonly items: { readonly data: ReadonlyArray<{ readonly price: { readonly id: string } }> };
}

/**
 * Maps Stripe SDK resources to Archipel's stable payment models.
 *
 * @internal
 */
export class StripeMapper {
    // #region Methods

    /**
     * Maps a Stripe checkout session to the stable checkout contract.
     *
     * @param session - Stripe checkout session.
     * @returns Normalized checkout session.
     */
    public mapCheckoutSession(session: Stripe.Checkout.Session): INormalizedCheckoutSession {
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : (session.subscription?.id ?? null);

        const customerId = typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null);

        return {
            id: session.id,
            url: session.url,
            subscriptionId,
            customerId,
            clientReferenceId: session.client_reference_id ?? null,
            paymentStatus: this.mapCheckoutPaymentStatus(session.payment_status),
        };
    }

    /**
     * Maps a Stripe price to the stable price contract.
     *
     * @param price - Stripe price.
     * @returns Normalized price.
     */
    public mapPrice(price: Stripe.Price): INormalizedPrice {
        let interval: 'month' | 'quarter' | 'year' | null = null;
        if (price.recurring?.interval === 'month') {
            interval = price.recurring.interval_count === 3 ? 'quarter' : 'month';
        } else if (price.recurring?.interval === 'year') {
            interval = 'year';
        }

        return {
            id: price.id,
            productId: typeof price.product === 'string' ? price.product : (price.product?.id ?? ''),
            amount: price.unit_amount ?? 0,
            currency: price.currency,
            interval,
            intervalCount: price.recurring?.interval_count ?? 1,
            active: price.active,
        };
    }

    /**
     * Maps a Stripe subscription to the stable subscription contract.
     *
     * @param subscription - Stripe subscription.
     * @returns Normalized subscription.
     */
    public mapSubscription(subscription: Stripe.Subscription): INormalizedSubscription {
        const projection = subscription as unknown as IStripeSubscriptionProjection;

        return {
            id: projection.id,
            customerId: projection.customer,
            status: this.mapSubscriptionStatus(projection.status),
            priceId: projection.items.data[0]?.price.id ?? '',
            currentPeriodStart: new Date(projection.current_period_start * 1000),
            currentPeriodEnd: new Date(projection.current_period_end * 1000),
            cancelAtPeriodEnd: projection.cancel_at_period_end,
            trialStart: projection.trial_start ? new Date(projection.trial_start * 1000) : null,
            trialEnd: projection.trial_end ? new Date(projection.trial_end * 1000) : null,
        };
    }

    /**
     * Maps a Stripe event to the stable webhook contract.
     *
     * @param event - Stripe webhook event.
     * @returns Normalized webhook event.
     */
    public mapWebhookEvent(event: Stripe.Event): INormalizedWebhookEvent {
        const type = this.mapEventType(event.type);
        let data: INormalizedWebhookEvent['data'] = {};

        if (type === 'checkout.session.completed') {
            data = {
                checkoutSession: this.mapCheckoutSession(event.data.object as Stripe.Checkout.Session),
            };
        } else if (type === 'subscription.updated' || type === 'subscription.deleted') {
            data = {
                subscription: this.mapSubscription(event.data.object as Stripe.Subscription),
            };
        } else if (type === 'invoice.payment_failed' || type === 'invoice.payment_succeeded') {
            const invoice = event.data.object as Stripe.Invoice & { readonly subscription?: string | { readonly id: string } };
            data = {
                invoice: {
                    id: invoice.id,
                    subscriptionId: typeof invoice.subscription === 'string' ? invoice.subscription : (invoice.subscription?.id ?? null),
                    status: this.mapInvoiceStatus(invoice.status),
                },
            };
        }

        return {
            type,
            data,
        };
    }

    private mapCheckoutPaymentStatus(status: Stripe.Checkout.Session.PaymentStatus): INormalizedCheckoutSession['paymentStatus'] {
        switch (status) {
            case 'no_payment_required':
                return 'noPaymentRequired';
            case 'paid':
                return 'paid';
            case 'unpaid':
                return 'unpaid';
            default:
                return 'unknown';
        }
    }

    private mapEventType(type: string): INormalizedWebhookEvent['type'] {
        const typeMap: Record<string, INormalizedWebhookEvent['type']> = {
            'checkout.session.completed': 'checkout.session.completed',
            'customer.subscription.updated': 'subscription.updated',
            'customer.subscription.deleted': 'subscription.deleted',
            'invoice.payment_failed': 'invoice.payment_failed',
            'invoice.payment_succeeded': 'invoice.payment_succeeded',
        };

        return typeMap[type] ?? 'unknown';
    }

    private mapInvoiceStatus(status: Stripe.Invoice.Status | null): NonNullable<INormalizedWebhookEvent['data']['invoice']>['status'] {
        switch (status) {
            case 'open':
                return 'open';
            case 'paid':
                return 'paid';
            case 'uncollectible':
                return 'uncollectible';
            case 'void':
                return 'void';
            case null:
            case 'draft':
                return 'draft';
            default:
                return 'unknown';
        }
    }

    private mapSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
        const statusMap: Partial<Record<Stripe.Subscription.Status, SubscriptionStatus>> = {
            active: 'active',
            canceled: 'canceled',
            incomplete: 'incomplete',
            incomplete_expired: 'incompleteExpired',
            past_due: 'pastDue',
            trialing: 'trialing',
            unpaid: 'unpaid',
            paused: 'paused',
        };

        return statusMap[status] ?? 'unknown';
    }

    // #endregion
}
