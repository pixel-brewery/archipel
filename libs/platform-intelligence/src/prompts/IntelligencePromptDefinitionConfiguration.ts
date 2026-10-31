// #region Imports

import type { IIntelligenceModelMessage } from '../contracts/IIntelligenceModelMessage.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import type { IIntelligencePromptExecutionPolicy } from './IIntelligencePromptExecutionPolicy.js';
import type { IIntelligencePromptRenderContext } from './IIntelligencePromptRenderContext.js';

// #endregion

interface IIntelligencePromptDefinitionConfigurationBase<TInput> {
    readonly name: string;
    readonly version: number;
    readonly inputSchema: IIntelligenceSchema<TInput>;
    readonly execution?: IIntelligencePromptExecutionPolicy;
    system(context: IIntelligencePromptRenderContext<TInput>): string | ReadonlyArray<string>;
    messages(context: IIntelligencePromptRenderContext<TInput>): ReadonlyArray<IIntelligenceModelMessage>;
}

/**
 * Configuration accepted by {@link intelligencePrompt}.
 *
 * @public
 */
export type IntelligencePromptDefinitionConfiguration<TInput, TOutput> =
    | (IIntelligencePromptDefinitionConfigurationBase<TInput> & {
          readonly mode: 'text';
          readonly outputSchema?: never;
      })
    | (IIntelligencePromptDefinitionConfigurationBase<TInput> & {
          readonly mode: 'object';
          readonly outputSchema: IIntelligenceSchema<TOutput>;
      });
