// #region Imports

import type { IIntelligenceModelMessage } from '../contracts/IIntelligenceModelMessage.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import type { IIntelligencePromptExecutionPolicy } from './IIntelligencePromptExecutionPolicy.js';
import type { IIntelligencePromptInvocation } from './IIntelligencePromptInvocation.js';
import type { IntelligencePromptMode } from './IntelligencePromptMode.js';
import type { IIntelligencePromptRenderContext } from './IIntelligencePromptRenderContext.js';

// #endregion

/**
 * Reusable, immutable definition of an intelligence prompt.
 *
 * @public
 */
export interface IIntelligencePromptDefinition<TInput, TOutput, TMode extends IntelligencePromptMode = IntelligencePromptMode> {
    // #region Properties

    readonly name: string;
    readonly version: number;
    readonly mode: TMode;
    readonly inputSchema: IIntelligenceSchema<TInput>;
    readonly outputSchema?: IIntelligenceSchema<TOutput>;
    readonly execution?: IIntelligencePromptExecutionPolicy;

    // #endregion

    // #region Methods

    system(context: IIntelligencePromptRenderContext<TInput>): string | ReadonlyArray<string>;
    messages(context: IIntelligencePromptRenderContext<TInput>): ReadonlyArray<IIntelligenceModelMessage>;
    with<TMetadata = undefined>(input: TInput, metadata?: TMetadata): IIntelligencePromptInvocation<TInput, TOutput, TMode, TMetadata>;

    // #endregion
}
