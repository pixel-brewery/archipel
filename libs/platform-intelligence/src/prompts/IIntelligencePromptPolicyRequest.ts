// #region Imports

import type { IIntelligencePromptExecutionContext } from './IIntelligencePromptExecutionContext.js';
import type { IIntelligencePromptExecutionPolicy } from './IIntelligencePromptExecutionPolicy.js';
import type { IntelligencePromptMode } from './IntelligencePromptMode.js';

// #endregion

/**
 * Policy resolution request for one prompt invocation.
 *
 * @public
 */
export interface IIntelligencePromptPolicyRequest {
    // #region Properties

    readonly promptName: string;
    readonly promptVersion: number;
    readonly mode: IntelligencePromptMode;
    readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
    readonly context: IIntelligencePromptExecutionContext;

    // #endregion
}
