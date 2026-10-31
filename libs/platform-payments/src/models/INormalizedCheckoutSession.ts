// #region Imports

import type { CheckoutPaymentStatus } from './CheckoutPaymentStatus.js';

// #endregion

/**
 * Normalized checkout session.
 *
 * @public
 */
export interface INormalizedCheckoutSession {
    readonly id: string;
    readonly url: string | null;
    readonly subscriptionId: string | null;
    readonly customerId: string | null;
    readonly clientReferenceId: string | null;
    readonly paymentStatus: CheckoutPaymentStatus;
}
