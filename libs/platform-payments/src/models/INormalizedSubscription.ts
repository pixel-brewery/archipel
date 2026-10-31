// #region Imports

import type { SubscriptionStatus } from './SubscriptionStatus.js';

// #endregion

/**
 * Normalized subscription.
 *
 * @public
 */
export interface INormalizedSubscription {
    readonly id: string;
    readonly customerId: string;
    readonly status: SubscriptionStatus;
    readonly priceId: string;
    readonly currentPeriodStart: Date;
    readonly currentPeriodEnd: Date;
    readonly cancelAtPeriodEnd: boolean;
    readonly trialStart: Date | null;
    readonly trialEnd: Date | null;
}
