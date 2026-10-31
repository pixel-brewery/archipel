// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadOpenAISdk } from '../loadOpenAISdk.js';
import { OpenAIIntelligenceToolNames } from '../OpenAIIntelligenceToolNames.js';

// #endregion

/**
 * Creates an OpenAI shell tool registration.
 *
 * @param options - OpenAI shell tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createOpenAIShellTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { openai } = await loadOpenAISdk();

    return createIntelligenceProviderTool(OpenAIIntelligenceToolNames.Shell, openai.tools.shell(options as never));
};
