// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadGrokSdk } from '../loadGrokSdk.js';
import { GrokIntelligenceToolNames } from '../GrokIntelligenceToolNames.js';

// #endregion

/**
 * Creates a Grok image-understanding tool registration.
 *
 * @param options - Grok image-understanding tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createGrokViewImageTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { xai } = await loadGrokSdk();

    return createIntelligenceProviderTool(GrokIntelligenceToolNames.ViewImage, xai.tools.viewImage(options as never));
};
