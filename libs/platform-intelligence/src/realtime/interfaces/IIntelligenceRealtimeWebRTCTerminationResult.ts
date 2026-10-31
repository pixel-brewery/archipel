// #region Imports

import type { IntelligenceRealtimeWebRTCTerminationStatus } from '../contracts/IntelligenceRealtimeWebRTCTerminationStatus.js';

// #endregion

/**
 * Result of ending a browser-owned WebRTC realtime session from the server.
 *
 * @public
 */
export interface IIntelligenceRealtimeWebRTCTerminationResult {
    // #region Properties

    /** Provider outcome of the termination request. */
    readonly status: IntelligenceRealtimeWebRTCTerminationStatus;

    /** Application-owned session identifier from the request. */
    readonly sessionId: string;

    /** Provider session identifier that the request addressed. */
    readonly providerSessionId: string;

    /** Resolved provider that handled the request. */
    readonly provider: string;

    /** Resolved model that selected the provider API. */
    readonly model: string;
    /**
     * Final cumulative voice duration in seconds that the provider reported
     * while this call closed the running session, for example GPT-Live's
     * `session.closed` usage. Absent when the session had already ended, the
     * provider reports no duration, or its control channel was unavailable
     * and the session was hung up instead.
     */
    readonly durationSeconds?: number;

    // #endregion
}
