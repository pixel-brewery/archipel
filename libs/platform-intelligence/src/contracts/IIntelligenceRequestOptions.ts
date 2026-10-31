// #region Imports

import type { IIntelligenceModelRequestOptions } from './IIntelligenceModelRequestOptions.js';

// #endregion

/**
 * Shared execution controls for bounded intelligence requests.
 *
 * @public
 */
export interface IIntelligenceRequestOptions extends IIntelligenceModelRequestOptions {
    // #region Properties

    /** Caller-driven cancellation signal. */
    readonly abortSignal?: AbortSignal;

    /** Additional outbound request headers. */
    readonly headers?: Readonly<Record<string, string>>;

    // #endregion
}
