// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadGoogleSdk } from '../loadGoogleSdk.js';
import { GoogleIntelligenceToolNames } from '../GoogleIntelligenceToolNames.js';

// #endregion

/**
 * Creates a Google file-search tool registration.
 *
 * @param options - Google file-search tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createGoogleFileSearchTool = async (options: IntelligenceProviderToolOptions): Promise<IIntelligenceTool> => {
    const { google } = await loadGoogleSdk();

    return createIntelligenceProviderTool(GoogleIntelligenceToolNames.FileSearch, google.tools.fileSearch(options as never));
};
