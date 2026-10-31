// #region Imports

import type { WebhookEventType } from './WebhookEventType.js';

// #endregion

/**
 * Normalized representation of a webhook event from an e-signing provider.
 *
 * @public
 */
export interface IEsigningWebhookEvent {
    /** Provider-specific event identifier. */
    readonly eventId: string;

    /** Normalized event type. */
    readonly eventType: WebhookEventType;

    /** Signing request the event relates to. */
    readonly signingRequestId: string;

    /** Signer the event relates to, if applicable. */
    readonly signerId?: string;

    /** Timestamp when the event occurred. */
    readonly occurredAt: Date;

    /** Provider-specific raw event payload. */
    readonly rawPayload: unknown;
}
