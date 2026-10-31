/**
 * Provider-independent subscription status values.
 * `unknown` represents a provider status without a normalized equivalent.
 *
 * @public
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'incompleteExpired' | 'pastDue' | 'trialing' | 'unpaid' | 'paused' | 'unknown';
