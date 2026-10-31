// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadAnthropicSdk } from '../loadAnthropicSdk.js';
import { AnthropicIntelligenceToolNames } from '../AnthropicIntelligenceToolNames.js';

// #endregion

/**
 * Creates an Anthropic code-execution tool registration for the 2026-01-20 version.
 *
 * @param options - Anthropic code-execution tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createAnthropicCodeExecution20260120Tool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { anthropic } = await loadAnthropicSdk();

    return createIntelligenceProviderTool(AnthropicIntelligenceToolNames.CodeExecution, anthropic.tools.codeExecution_20260120(options as never));
};
