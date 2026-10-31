// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadOpenAISdk } from '../loadOpenAISdk.js';

// #endregion

/**
 * Creates an OpenAI custom provider-defined tool registration.
 *
 * @param options - OpenAI custom tool options.
 * @param name - Optional Archipel registry name.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createOpenAICustomTool = async (options: IntelligenceProviderToolOptions, name: string): Promise<IIntelligenceTool> => {
    const { openai } = await loadOpenAISdk();

    return createIntelligenceProviderTool(name, openai.tools.customTool(options as never));
};
