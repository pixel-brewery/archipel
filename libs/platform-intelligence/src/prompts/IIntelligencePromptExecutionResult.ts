// #region Imports

import type { IIntelligenceUsage } from '../contracts/IIntelligenceUsage.js';
import type { IIntelligencePromptEffectivePolicy } from './IIntelligencePromptEffectivePolicy.js';
import type { IIntelligencePromptExecutionPolicy } from './IIntelligencePromptExecutionPolicy.js';

// #endregion

/**
 * Normalized result of an intelligence prompt execution.
 *
 * @public
 */
export interface IIntelligencePromptExecutionResult<TOutput, TMetadata = undefined> {
    // #region Properties

    readonly output: TOutput;
    readonly promptName: string;
    readonly promptVersion: number;
    readonly provider: string;
    readonly model: string;
    readonly usage: IIntelligenceUsage | null;
    /**
     * Usage of each provider call in execution order; `usage` is their sum. See
     * `IIntelligenceLanguageCompletion.stepUsage`.
     */
    readonly stepUsage?: ReadonlyArray<IIntelligenceUsage | null>;
    readonly reasoningText?: string;
    readonly finishReason: string;
    readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
    readonly effectivePolicy: IIntelligencePromptEffectivePolicy;
    readonly metadata: TMetadata | undefined;

    // #endregion
}
