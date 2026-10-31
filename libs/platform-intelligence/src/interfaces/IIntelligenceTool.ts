// #region Imports

import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import type { IIntelligenceProviderToolDefinition } from '../providers/IIntelligenceProviderToolDefinition.js';

// #endregion

/**
 * Minimal shape required by the intelligence tool registry.
 *
 * @public
 */
export interface IIntelligenceTool {
    // #region Properties

    /**
     * Gets the unique registry name for the tool.
     *
     * @public
     * @readonly
     */
    readonly name: string;

    /**
     * Gets the provider-neutral or opaque provider-owned tool definition.
     *
     * @public
     * @readonly
     */
    readonly tool: IIntelligenceToolDefinition | IIntelligenceProviderToolDefinition;

    // #endregion
}
