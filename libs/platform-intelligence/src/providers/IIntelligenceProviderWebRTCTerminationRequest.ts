// #region Imports

import type { IIntelligenceProviderLoadRequest } from './IIntelligenceProviderLoadRequest.js';

// #endregion

/**
 * Provider request to end one browser-owned WebRTC realtime session.
 *
 * The inherited configuration carries the resolved provider credentials, the
 * realtime model that selects the provider API, and the request timeouts.
 *
 * @public
 */
export interface IIntelligenceProviderWebRTCTerminationRequest extends IIntelligenceProviderLoadRequest {
    // #region Properties

    /** Provider session identifier returned by the provider during WebRTC setup. */
    readonly providerSessionId: string;

    /** Aborts the outstanding provider request when the termination budget expires. */
    readonly abortSignal: AbortSignal;

    // #endregion
}
