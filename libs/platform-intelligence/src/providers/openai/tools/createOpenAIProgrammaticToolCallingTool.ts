// #region Imports

import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadOpenAISdk } from '../loadOpenAISdk.js';
import { OpenAIIntelligenceToolNames } from '../OpenAIIntelligenceToolNames.js';

// #endregion

/**
 * Creates an OpenAI programmatic tool-calling registration.
 *
 * Responses models write and execute JavaScript that orchestrates eligible tools. The AI SDK marks this tool as
 * experimental.
 *
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createOpenAIProgrammaticToolCallingTool = async (): Promise<IIntelligenceTool> => {
    const { openai } = await loadOpenAISdk();

    return createIntelligenceProviderTool(OpenAIIntelligenceToolNames.ProgrammaticToolCalling, openai.tools.programmaticToolCalling() as never);
};
