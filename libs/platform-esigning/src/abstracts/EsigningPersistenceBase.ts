import type { ISigningRequest } from '../models/ISigningRequest.js';

/**
 * Abstract base for persisting signing request state.
 * Implement this abstract base in the consuming application to track signing requests in a database.
 *
 * @public
 */
export abstract class EsigningPersistenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Persist a newly created signing request.
     *
     * @public
     * @param signingRequest - The signing request to persist.
     */
    public abstract onSigningRequestCreated(signingRequest: ISigningRequest): Promise<void>;

    /**
     * Update persisted state when a signing request status changes.
     *
     * @public
     * @param signingRequestId - The provider-specific signing request identifier.
     * @param status - The new status of the signing request.
     */
    public abstract onSigningRequestStatusChanged(signingRequestId: string, status: string): Promise<void>;

    /**
     * Update persisted state when a signing request is cancelled.
     *
     * @public
     * @param signingRequestId - The provider-specific signing request identifier.
     */
    public abstract onSigningRequestCancelled(signingRequestId: string): Promise<void>;

    // #endregion
}
