// #region Imports

import type { IntelligencePromptGenerationOptions } from './IntelligencePromptGenerationOptions.js';
import type { IntelligencePromptCapability } from './IntelligencePromptCapability.js';

// #endregion

/**
 * Effective settings resolved for one prompt execution.
 *
 * @public
 */
export interface IIntelligencePromptEffectivePolicy {
    // #region Properties

    readonly options: IntelligencePromptGenerationOptions;
    readonly capabilities: ReadonlyArray<IntelligencePromptCapability>;

    // #endregion
}
