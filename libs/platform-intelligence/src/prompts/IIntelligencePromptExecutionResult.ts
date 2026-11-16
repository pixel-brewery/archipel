// #region Imports

import type { IIntelligenceLanguageCompletion } from '../contracts/IIntelligenceLanguageCompletion.js';
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
    /**
     * Sources the provider cited for the generated output, for example web results of a provider-owned search.
     * Empty when the provider reported none.
     */
    readonly sources?: IIntelligenceLanguageCompletion<unknown>['sources'];
    readonly requestedPolicy: IIntelligencePromptExecutionPolicy;
    readonly effectivePolicy: IIntelligencePromptEffectivePolicy;
    readonly metadata: TMetadata | undefined;

    // #endregion
}
