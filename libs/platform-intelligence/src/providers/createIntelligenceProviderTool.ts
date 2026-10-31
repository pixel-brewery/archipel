// #region Imports

import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';

// #endregion

/**
 * Wraps a provider-native tool without exposing its SDK type through Archipel.
 *
 * @internal
 */
export function createIntelligenceProviderTool(name: string, nativeDefinition: unknown): IIntelligenceTool {
    return {
        name,
        tool: {
            kind: 'provider-tool',
            nativeDefinition,
        },
    };
}
