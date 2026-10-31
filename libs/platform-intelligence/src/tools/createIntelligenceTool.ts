// #region Imports

import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';

// #endregion

/**
 * Creates an Archipel intelligence tool registration.
 *
 * @param name - Tool name used as key in the AI SDK tool set.
 * @param tool - Provider-neutral tool definition.
 * @returns Tool registration compatible with {@link IIntelligenceToolRegistry}.
 *
 * @public
 */
export const createIntelligenceTool = (name: string, tool: IIntelligenceToolDefinition): IIntelligenceTool => ({
    name,
    tool,
});
