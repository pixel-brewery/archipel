// #region Imports

import type { IIntelligenceLanguageGenerationOptions } from '../contracts/IIntelligenceLanguageGenerationOptions.js';

// #endregion

/**
 * Native generation settings that can be stored on a prompt definition.
 *
 * The output contract is owned by the prompt mode and cannot be overridden.
 *
 * @public
 */
export type IntelligencePromptGenerationOptions = IIntelligenceLanguageGenerationOptions;
