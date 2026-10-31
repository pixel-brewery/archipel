// #region Imports

import type { IIntelligenceToolCall } from './IIntelligenceToolCall.js';
import type { IntelligenceToolOutput } from './IntelligenceToolOutput.js';

// #endregion

/**
 * Tool execution completion event.
 *
 * @public
 */
export interface IIntelligenceToolExecutionEndEvent {
    readonly callId: string;
    readonly toolCall: IIntelligenceToolCall;
    readonly toolOutput: IntelligenceToolOutput;
    readonly toolExecutionMs: number;
}
