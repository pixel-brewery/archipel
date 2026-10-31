// #region Imports

import type { IntelligenceRealtimeConversationHistoryStatus } from '../contracts/IntelligenceRealtimeConversationHistoryStatus.js';

// #endregion

/**
 * SDP answer and data-channel information returned to the browser.
 *
 * The browser owns media, events, and the connection lifecycle after setup.
 *
 * @public
 */
export interface IIntelligenceRealtimeWebRTCSessionResult {
    // #region Properties

    readonly connectionMode: 'webrtc';
    readonly sessionId: string;
    readonly providerSessionId: string;
    readonly provider: string;
    readonly model: string;
    readonly answerSdp: string;
    readonly dataChannelLabel: string;

    /** Outcome of the requested `conversationHistory`; absent when none was requested. */
    readonly conversationHistory?: IntelligenceRealtimeConversationHistoryStatus;

    // #endregion
}
