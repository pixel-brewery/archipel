/**
 * Provider-independent checkout payment status values.
 * `unknown` represents a provider status without a normalized equivalent.
 *
 * @public
 */
export type CheckoutPaymentStatus = 'paid' | 'unpaid' | 'noPaymentRequired' | 'unknown';
