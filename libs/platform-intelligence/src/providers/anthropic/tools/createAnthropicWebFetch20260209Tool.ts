// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadAnthropicSdk } from '../loadAnthropicSdk.js';
import { AnthropicIntelligenceToolNames } from '../AnthropicIntelligenceToolNames.js';

// #endregion

/**
 * Creates an Anthropic web-fetch tool registration for the 2026-02-09 version.
 *
 * @param options - Anthropic web-fetch tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createAnthropicWebFetch20260209Tool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { anthropic } = await loadAnthropicSdk();

    return createIntelligenceProviderTool(AnthropicIntelligenceToolNames.WebFetch, anthropic.tools.webFetch_20260209(options as never));
};
