// #region Imports

import type { IntelligenceRealtimeWebRTCTerminationStatus } from '../realtime/contracts/IntelligenceRealtimeWebRTCTerminationStatus.js';

// #endregion

/**
 * Outcome of ending a browser-owned WebRTC session through a provider's
 * server control channel.
 *
 * @public
 */
export interface IIntelligenceProviderWebRTCClosure {
    // #region Properties

    /**
     * `terminated` when this call closed the running session, or
     * `already-ended` when the provider no longer knew it.
     */
    readonly status: Extract<IntelligenceRealtimeWebRTCTerminationStatus, 'terminated' | 'already-ended'>;

    /**
     * Final cumulative voice duration in seconds that the provider reported
     * for the closed session, or `null` when it reported none.
     */
    readonly durationSeconds: number | null;

    // #endregion
}
