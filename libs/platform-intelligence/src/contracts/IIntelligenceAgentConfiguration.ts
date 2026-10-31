// #region Imports

import type { IIntelligenceDeferredToolLoadingOptions } from './IIntelligenceDeferredToolLoadingOptions.js';
import type { IIntelligenceModelReference } from './IIntelligenceModelReference.js';
import type { IntelligenceToolSet } from './IntelligenceToolSet.js';

// #endregion

/**
 * Reusable provider-neutral tool-loop agent configuration.
 *
 * @public
 */
export interface IIntelligenceAgentConfiguration {
    // #region Properties

    readonly name?: string;
    readonly instructions: string;
    readonly model?: IIntelligenceModelReference;
    readonly tools?: IntelligenceToolSet;
    /**
     * Default tool subset of every run.
     *
     * A run that supplies its own `activeToolNames` or `deferredToolLoading`
     * replaces this agent-level tool exposure as a whole.
     */
    readonly activeToolNames?: ReadonlyArray<string>;
    /**
     * Default on-demand tool exposure of every run.
     *
     * A run that supplies its own `activeToolNames` or `deferredToolLoading`
     * replaces this agent-level tool exposure as a whole. Requires `maxSteps`
     * of at least `2`.
     */
    readonly deferredToolLoading?: IIntelligenceDeferredToolLoadingOptions;
    readonly maxSteps?: number;

    // #endregion
}
