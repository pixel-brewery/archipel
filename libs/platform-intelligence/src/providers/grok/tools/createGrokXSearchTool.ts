// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadGrokSdk } from '../loadGrokSdk.js';
import { GrokIntelligenceToolNames } from '../GrokIntelligenceToolNames.js';

// #endregion

/**
 * Creates a Grok X-search tool registration.
 *
 * @param options - Grok X-search tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createGrokXSearchTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { xai } = await loadGrokSdk();

    return createIntelligenceProviderTool(GrokIntelligenceToolNames.XSearch, xai.tools.xSearch(options as never));
};
