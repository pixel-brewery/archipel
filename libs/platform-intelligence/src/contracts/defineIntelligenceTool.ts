// #region Imports

import type { IIntelligenceToolDefinition } from './IIntelligenceToolDefinition.js';

// #endregion

/**
 * Defines a provider-neutral intelligence tool while preserving its input and output types.
 *
 * @public
 */
export function defineIntelligenceTool<TInput, TOutput>(
    definition: IIntelligenceToolDefinition<TInput, TOutput>,
): IIntelligenceToolDefinition<TInput, TOutput> {
    return definition;
}
