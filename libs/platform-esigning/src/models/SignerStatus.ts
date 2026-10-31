/**
 * Represents the status of an individual signer within a signing request.
 *
 * @public
 */
export const SignerStatuses = {
    Pending: 'pending',
    Sent: 'sent',
    Delivered: 'delivered',
    Signed: 'signed',
    Declined: 'declined',
    Expired: 'expired',
} as const;

/**
 * Union type derived from {@link SignerStatuses}.
 *
 * @public
 */
export type SignerStatus = (typeof SignerStatuses)[keyof typeof SignerStatuses];
