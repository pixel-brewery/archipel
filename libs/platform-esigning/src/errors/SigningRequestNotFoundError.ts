// #region Imports

import { EsigningError } from './EsigningError.js';

// #endregion

/**
 * Thrown when a signing request cannot be found by the provider.
 *
 * @public
 */
export class SigningRequestNotFoundError extends EsigningError {
    // #region Fields

    private readonly _signingRequestId: string;

    // #endregion

    // #region Ctor

    public constructor(signingRequestId: string) {
        super(`Signing request '${signingRequestId}' not found.`, 'SIGNING_REQUEST_NOT_FOUND');
        this.name = 'SigningRequestNotFoundError';
        this._signingRequestId = signingRequestId;
    }

    // #endregion

    // #region Properties

    /** The identifier of the signing request that was not found. */
    public get signingRequestId(): string {
        return this._signingRequestId;
    }

    // #endregion
}
