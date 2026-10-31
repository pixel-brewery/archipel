// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadAnthropicSdk } from '../loadAnthropicSdk.js';
import { AnthropicIntelligenceToolNames } from '../AnthropicIntelligenceToolNames.js';

// #endregion

/**
 * Creates an Anthropic regex tool-search tool registration.
 *
 * @param options - Anthropic regex tool-search options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createAnthropicToolSearchRegex20251119Tool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { anthropic } = await loadAnthropicSdk();

    return createIntelligenceProviderTool(AnthropicIntelligenceToolNames.ToolSearchRegex, anthropic.tools.toolSearchRegex_20251119(options as never));
};
