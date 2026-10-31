// #region Imports

import type { IIntelligencePromptDefinition } from './IIntelligencePromptDefinition.js';
import type { IntelligencePromptMode } from './IntelligencePromptMode.js';

// #endregion

/**
 * Bound prompt definition ready for execution.
 *
 * @public
 */
export interface IIntelligencePromptInvocation<TInput, TOutput, TMode extends IntelligencePromptMode, TMetadata = undefined> {
    // #region Properties

    readonly definition: IIntelligencePromptDefinition<TInput, TOutput, TMode>;
    readonly input: Readonly<TInput>;
    readonly metadata: TMetadata | undefined;

    // #endregion
}
