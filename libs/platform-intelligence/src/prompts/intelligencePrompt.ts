// #region Imports

import type { IIntelligencePromptDefinition } from './IIntelligencePromptDefinition.js';
import type { IIntelligencePromptInvocation } from './IIntelligencePromptInvocation.js';
import type { IntelligencePromptDefinitionConfiguration } from './IntelligencePromptDefinitionConfiguration.js';
import type { IntelligencePromptMode } from './IntelligencePromptMode.js';

// #endregion

/**
 * Creates a reusable intelligence prompt definition.
 *
 * @public
 */
export function intelligencePrompt<TInput, TOutput = string>(
    configuration: IntelligencePromptDefinitionConfiguration<TInput, TOutput>,
): IIntelligencePromptDefinition<TInput, TOutput, typeof configuration.mode> {
    const definition: IIntelligencePromptDefinition<TInput, TOutput, IntelligencePromptMode> = {
        ...configuration,
        with<TMetadata = undefined>(input: TInput, metadata?: TMetadata): IIntelligencePromptInvocation<TInput, TOutput, IntelligencePromptMode, TMetadata> {
            return Object.freeze({
                definition,
                input,
                metadata,
            });
        },
    };

    return Object.freeze(definition) as IIntelligencePromptDefinition<TInput, TOutput, typeof configuration.mode>;
}
