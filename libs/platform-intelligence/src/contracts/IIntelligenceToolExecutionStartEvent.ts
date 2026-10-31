// #region Imports

import type { IIntelligenceToolCall } from './IIntelligenceToolCall.js';

// #endregion

/**
 * Tool execution start event.
 *
 * @public
 */
export interface IIntelligenceToolExecutionStartEvent {
    readonly callId: string;
    readonly toolCall: IIntelligenceToolCall;
}
