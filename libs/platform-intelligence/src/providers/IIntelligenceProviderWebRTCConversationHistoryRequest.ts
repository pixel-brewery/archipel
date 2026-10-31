// #region Imports

import type { IIntelligenceRealtimeConversationTurn } from '../realtime/contracts/IIntelligenceRealtimeConversationTurn.js';
import type { IIntelligenceRealtimeSessionConfiguration } from '../realtime/contracts/IIntelligenceRealtimeSessionConfiguration.js';
import type { IIntelligenceProviderLoadRequest } from './IIntelligenceProviderLoadRequest.js';

// #endregion

/**
 * Provider request to add earlier conversation turns to the setup of one
 * browser-owned WebRTC realtime session.
 *
 * The inherited configuration carries the realtime model that selects the
 * provider API. The turns are already validated against
 * `IntelligenceRealtimeConversationHistoryLimits`.
 *
 * @public
 */
export interface IIntelligenceProviderWebRTCConversationHistoryRequest extends IIntelligenceProviderLoadRequest {
    // #region Properties

    /** Session configuration the application passed for the SDP exchange. */
    readonly sessionConfiguration: IIntelligenceRealtimeSessionConfiguration;

    /** Earlier turns of the conversation, oldest first. */
    readonly conversationHistory: ReadonlyArray<IIntelligenceRealtimeConversationTurn>;

    // #endregion
}
