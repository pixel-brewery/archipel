// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadGoogleSdk } from '../loadGoogleSdk.js';
import { GoogleIntelligenceToolNames } from '../GoogleIntelligenceToolNames.js';

// #endregion

/**
 * Creates a Google enterprise-web-search tool registration.
 *
 * @param options - Google enterprise-web-search tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createGoogleEnterpriseWebSearchTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { google } = await loadGoogleSdk();

    return createIntelligenceProviderTool(GoogleIntelligenceToolNames.EnterpriseWebSearch, google.tools.enterpriseWebSearch(options as never));
};
