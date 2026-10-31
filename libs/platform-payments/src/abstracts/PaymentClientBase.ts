import type { INormalizedCheckoutSession } from '../models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from '../models/INormalizedPrice.js';
import type { INormalizedSubscription } from '../models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from '../models/INormalizedWebhookEvent.js';

/**
 * Abstract base for payment provider clients.
 * Each provider (Stripe, Paddle, LemonSqueezy, Mollie) must implement this contract
 * so that the consuming application can switch providers without changing business logic.
 *
 * @public
 */
export abstract class PaymentClientBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Fetch all active prices for a product.
     *
     * @public
     * @param productId - External product identifier.
     * @returns Array of normalized prices.
     */
    public abstract fetchPrices(productId: string): Promise<Array<INormalizedPrice>>;

    /**
     * Create a checkout session.
     *
     * @public
     * @param priceId - Price identifier.
     * @param successUrl - Success redirect URL.
     * @param cancelUrl - Cancel redirect URL.
     * @param userId - Optional user reference.
     * @returns Normalized checkout session.
     */
    public abstract createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string, userId?: string): Promise<INormalizedCheckoutSession>;

    /**
     * Retrieve subscription details.
     *
     * @public
     * @param subscriptionId - Subscription identifier.
     * @returns Normalized subscription or `null` if not found.
     */
    public abstract fetchSubscription(subscriptionId: string): Promise<INormalizedSubscription | null>;

    /**
     * Construct and normalize a webhook event from raw payload.
     *
     * @public
     * @param payload - Raw webhook body.
     * @param signature - Webhook signature header.
     * @returns Normalized webhook event.
     */
    public abstract constructWebhookEvent(payload: string | Buffer, signature: string): Promise<INormalizedWebhookEvent> | INormalizedWebhookEvent;

    /**
     * Lightweight connectivity check for the payment provider.
     * Override in adapters to perform a real API call (e.g. list products).
     * Defaults to `true` if not overridden.
     *
     * @public
     * @returns `true` if the provider is reachable.
     */
    public async ping(): Promise<boolean> {
        return true;
    }

    // #endregion
}
