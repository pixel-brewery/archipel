// #region Imports

import type { IntelligenceProviderToolOptions } from '../../../contracts/IntelligenceProviderToolOptions.js';
import type { IIntelligenceTool } from '../../../interfaces/IIntelligenceTool.js';
import { createIntelligenceProviderTool } from '../../createIntelligenceProviderTool.js';
import { loadGoogleSdk } from '../loadGoogleSdk.js';
import { GoogleIntelligenceToolNames } from '../GoogleIntelligenceToolNames.js';

// #endregion

/**
 * Creates a Google code-execution tool registration.
 *
 * @param options - Google code-execution tool options.
 * @returns Tool registration compatible with the intelligence tool registry.
 *
 * @public
 */
export const createGoogleCodeExecutionTool = async (options: IntelligenceProviderToolOptions = {}): Promise<IIntelligenceTool> => {
    const { google } = await loadGoogleSdk();

    return createIntelligenceProviderTool(GoogleIntelligenceToolNames.CodeExecution, google.tools.codeExecution(options as never));
};
