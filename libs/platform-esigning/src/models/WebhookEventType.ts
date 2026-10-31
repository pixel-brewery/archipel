/**
 * Represents the type of webhook event emitted by a signing provider.
 *
 * @public
 */
export const WebhookEventTypes = {
    SigningRequestCompleted: 'signing-request.completed',
    SigningRequestDeclined: 'signing-request.declined',
    SigningRequestVoided: 'signing-request.voided',
    SigningRequestExpired: 'signing-request.expired',
    SigningRequestSent: 'signing-request.sent',
    SignerCompleted: 'signer.completed',
    SignerDeclined: 'signer.declined',
    SignerSent: 'signer.sent',
    SignerDelivered: 'signer.delivered',
} as const;

/**
 * Union type derived from {@link WebhookEventTypes}.
 *
 * @public
 */
export type WebhookEventType = (typeof WebhookEventTypes)[keyof typeof WebhookEventTypes];
