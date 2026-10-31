// #region Imports

import type { IntelligencePromptGenerationOptions } from './IntelligencePromptGenerationOptions.js';
import type { IntelligencePromptCapability } from './IntelligencePromptCapability.js';
import type { IntelligencePromptLatency } from './IntelligencePromptLatency.js';
import type { IIntelligencePromptModelRequirement } from './IIntelligencePromptModelRequirement.js';
import type { IntelligencePromptQuality } from './IntelligencePromptQuality.js';
import type { IntelligencePromptReasoning } from './IntelligencePromptReasoning.js';

// #endregion

/**
 * Native settings and provider-neutral requirements declared by an intelligence prompt.
 *
 * @public
 */
export interface IIntelligencePromptExecutionPolicy {
    // #region Properties

    readonly options?: IntelligencePromptGenerationOptions;
    readonly quality?: IntelligencePromptQuality;
    readonly reasoning?: IntelligencePromptReasoning;
    readonly latency?: IntelligencePromptLatency;
    readonly model?: IIntelligencePromptModelRequirement;
    readonly requiredCapabilities?: ReadonlyArray<IntelligencePromptCapability>;

    // #endregion
}
