// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadAnthropicSdk } from '../loadAnthropicSdk.js';
import { AnthropicIntelligenceToolNames } from '../AnthropicIntelligenceToolNames.js';

// #endregion

/**
 * Creates an Anthropic text-editor tool registration for the 2025-04-29 version.
 *
 * @param options - Anthropic text-editor tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createAnthropicTextEditor20250429Tool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { anthropic } = await loadAnthropicSdk();

    return createIntelligenceProviderTool(AnthropicIntelligenceToolNames.TextEditorBasedEdit, anthropic.tools.textEditor_20250429(options as never));
};
