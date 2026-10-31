// #region Imports

import type { IIntelligenceRealtimeConversationTurn } from '../contracts/IIntelligenceRealtimeConversationTurn.js';
import type { IIntelligenceRealtimeSessionOptions } from './IIntelligenceRealtimeSessionOptions.js';

// #endregion

/**
 * Server-side SDP exchange for a browser-owned WebRTC realtime session.
 *
 * @public
 */
export interface IIntelligenceRealtimeWebRTCSessionOptions extends Pick<
    IIntelligenceRealtimeSessionOptions,
    'requestId' | 'sessionId' | 'model' | 'provider' | 'sessionConfiguration'
> {
    // #region Properties

    readonly connectionMode: 'webrtc';

    /** Browser-generated SDP offer. The application must authenticate its caller. */
    readonly offerSdp: string;

    /**
     * Earlier turns of the same conversation, oldest first, for a session that
     * continues it on a new provider connection, for example after a pause,
     * a dropped connection, or a page reload.
     *
     * The provider receives the turns with the session setup as one quoted,
     * untrusted context block: never as instructions and never as the model's
     * own statements, so a browser-reported transcript cannot speak for the
     * model. The handover does not make the model respond. The history must
     * stay within `IntelligenceRealtimeConversationHistoryLimits`; a larger one
     * is rejected, not shortened. The result reports whether the provider
     * received it.
     */
    readonly conversationHistory?: ReadonlyArray<IIntelligenceRealtimeConversationTurn>;

    // #endregion
}
