/**
 * Represents the lifecycle status of a signing request.
 *
 * @public
 */
export const SigningRequestStatuses = {
    Draft: 'draft',
    Sent: 'sent',
    InProgress: 'in-progress',
    Completed: 'completed',
    Declined: 'declined',
    Cancelled: 'cancelled',
    Expired: 'expired',
    Voided: 'voided',
} as const;

/**
 * Union type derived from {@link SigningRequestStatuses}.
 *
 * @public
 */
export type SigningRequestStatus = (typeof SigningRequestStatuses)[keyof typeof SigningRequestStatuses];
