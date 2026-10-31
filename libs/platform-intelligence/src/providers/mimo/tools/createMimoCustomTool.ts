// #region Imports

import type { IIntelligenceToolDefinition } from '../../../contracts/IIntelligenceToolDefinition.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceTool } from '../../../tools/createIntelligenceTool.js';

// #endregion

/**
 * Creates a provider-neutral function tool for MiMo.
 *
 * MiMo exposes OpenAI-compatible function tools, so this adapter keeps the same
 * Archipel shape as the other provider-specific tool factories.
 *
 * @param definition - Provider-neutral Archipel tool definition.
 * @param name - Archipel registry name.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createMimoCustomTool = (definition: IIntelligenceToolDefinition, name: string): IIntelligenceTool => createIntelligenceTool(name, definition);
