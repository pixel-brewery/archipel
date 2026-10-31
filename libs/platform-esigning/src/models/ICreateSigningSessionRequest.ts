/**
 * Input for creating a signing session (signing link) for a specific signer.
 *
 * @public
 */
export interface ICreateSigningSessionRequest {
    /** Identifier of the signing request. */
    readonly signingRequestId: string;

    /** Identifier of the signer to generate the session for. */
    readonly signerId: string;

    /** URL to redirect the signer to after completing the signing. */
    readonly returnUrl?: string;
}
