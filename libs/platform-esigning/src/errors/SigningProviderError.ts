// #region Imports

import { EsigningError } from './EsigningError.js';

// #endregion

/**
 * Thrown when a provider-level operation fails.
 *
 * @public
 */
export class SigningProviderError extends EsigningError {
    // #region Fields

    private readonly _providerId: string;
    private readonly _cause: unknown;

    // #endregion

    // #region Ctor

    public constructor(providerId: string, message: string, cause?: unknown) {
        super(`[${providerId}] ${message}`, 'SIGNING_PROVIDER_ERROR');
        this.name = 'SigningProviderError';
        this._providerId = providerId;
        this._cause = cause;
    }

    // #endregion

    // #region Properties

    /** Identifier of the provider that failed. */
    public get providerId(): string {
        return this._providerId;
    }

    /** Original error or cause, if available. */
    public get rootCause(): unknown {
        return this._cause;
    }

    // #endregion
}
