// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadOpenAISdk } from '../loadOpenAISdk.js';
import { OpenAIIntelligenceToolNames } from '../OpenAIIntelligenceToolNames.js';

// #endregion

/**
 * Creates an OpenAI image-generation tool registration.
 *
 * @param options - OpenAI image-generation tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createOpenAIImageGenerationTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { openai } = await loadOpenAISdk();

    return createIntelligenceProviderTool(OpenAIIntelligenceToolNames.ImageGeneration, openai.tools.imageGeneration(options as never));
};
