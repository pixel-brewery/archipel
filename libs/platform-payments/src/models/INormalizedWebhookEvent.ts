// #region Imports

import type { INormalizedCheckoutSession } from './INormalizedCheckoutSession.js';
import type { INormalizedSubscription } from './INormalizedSubscription.js';
import type { InvoiceStatus } from './InvoiceStatus.js';

// #endregion

/**
 * Normalized webhook event.
 *
 * @public
 */
export interface INormalizedWebhookEvent {
    readonly type:
        'checkout.session.completed' | 'subscription.updated' | 'subscription.deleted' | 'invoice.payment_failed' | 'invoice.payment_succeeded' | 'unknown';
    readonly data: {
        readonly checkoutSession?: INormalizedCheckoutSession;
        readonly subscription?: INormalizedSubscription;
        readonly invoice?: {
            readonly id: string;
            readonly subscriptionId: string | null;
            readonly status: InvoiceStatus;
        };
    };
}
