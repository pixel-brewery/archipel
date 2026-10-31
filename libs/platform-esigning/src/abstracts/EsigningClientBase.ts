import type { ICreateSigningRequest } from '../models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from '../models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from '../models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from '../models/ISignedDocument.js';
import type { ISigningRequest } from '../models/ISigningRequest.js';
import type { ISigningSession } from '../models/ISigningSession.js';

/**
 * Abstract base for e-signing provider clients.
 * Each provider (DocuSign, Adobe Sign, Dropbox Sign, Internal) must implement
 * this contract so that the consuming application can switch providers without changing business logic.
 *
 * @public
 */
export abstract class EsigningClientBase {
    // #region Fields

    /** Unique identifier of the provider implementation. */
    public abstract readonly providerId: string;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Create a new signing request (envelope/agreement).
     *
     * @public
     * @param request - The signing request creation input.
     * @returns The created signing request with provider-assigned identifiers.
     */
    public abstract createSigningRequest(request: ICreateSigningRequest): Promise<ISigningRequest>;

    /**
     * Generate a signing session (signing link/URL) for a specific signer.
     *
     * @public
     * @param request - The session creation input.
     * @returns The signing session with the signing URL.
     */
    public abstract createSigningSession(request: ICreateSigningSessionRequest): Promise<ISigningSession>;

    /**
     * Retrieve the current status and details of a signing request.
     *
     * @public
     * @param signingRequestId - The provider-specific signing request identifier.
     * @returns The signing request with current status.
     */
    public abstract getSigningRequest(signingRequestId: string): Promise<ISigningRequest>;

    /**
     * Retrieve the final signed documents for a completed signing request.
     *
     * @public
     * @param signingRequestId - The provider-specific signing request identifier.
     * @returns Array of signed documents with their content.
     */
    public abstract getSignedDocuments(signingRequestId: string): Promise<Array<ISignedDocument>>;

    /**
     * Cancel an in-progress signing request.
     *
     * @public
     * @param signingRequestId - The provider-specific signing request identifier.
     * @param reason - Optional reason for cancellation.
     */
    public abstract cancelSigningRequest(signingRequestId: string, reason?: string): Promise<void>;

    /**
     * Verify a webhook payload signature and return a normalized event.
     *
     * @public
     * @param payload - Raw webhook body.
     * @param signature - Webhook signature header value.
     * @param headers - Optional webhook request headers (for timestamp/nonce validation).
     * @returns Normalized webhook event.
     */
    public abstract verifyWebhook(payload: string | Buffer, signature: string, headers?: Record<string, string>): Promise<IEsigningWebhookEvent>;

    /**
     * Lightweight connectivity check for the e-signing provider.
     * Override in adapters to perform a real API call (e.g. account info).
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
