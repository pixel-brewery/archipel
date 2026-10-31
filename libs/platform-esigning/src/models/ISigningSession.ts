/**
 * Normalized representation of a signing session or signing link.
 *
 * @public
 */
export interface ISigningSession {
    /** Provider-specific session identifier. */
    readonly sessionId: string;

    /** Signing request this session belongs to. */
    readonly signingRequestId: string;

    /** Signer this session was created for. */
    readonly signerId: string;

    /** URL the signer should be directed to for signing. */
    readonly signingUrl: string;

    /** Timestamp when the session expires. */
    readonly expiresAt: Date;
}
