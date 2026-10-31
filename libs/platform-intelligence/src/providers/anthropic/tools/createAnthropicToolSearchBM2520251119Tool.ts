// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadAnthropicSdk } from '../loadAnthropicSdk.js';
import { AnthropicIntelligenceToolNames } from '../AnthropicIntelligenceToolNames.js';

// #endregion

/**
 * Creates an Anthropic BM25 tool-search tool registration.
 *
 * @param options - Anthropic BM25 tool-search options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createAnthropicToolSearchBM2520251119Tool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { anthropic } = await loadAnthropicSdk();

    return createIntelligenceProviderTool(AnthropicIntelligenceToolNames.ToolSearchBM25, anthropic.tools.toolSearchBm25_20251119(options as never));
};
