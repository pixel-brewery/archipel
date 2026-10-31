// #region Imports

import type { IIntelligenceLanguageCallCapacity } from './IIntelligenceLanguageCallCapacity.js';
import type { IIntelligenceLanguageCompletion } from './IIntelligenceLanguageCompletion.js';

// #endregion

/**
 * Single-use language call whose local model, option, prompt, and tool
 * preparation has already completed.
 *
 * @public
 */
export interface IIntelligencePreparedLanguageCall<TOutput = string> {
    // #region Properties

    readonly provider: string;
    readonly model: string;
    /** Standardized initial provider-input facts captured without network access. */
    readonly capacity: IIntelligenceLanguageCallCapacity;

    // #endregion

    // #region Methods

    /** Executes this prepared call once. A second invocation is rejected. */
    execute(): Promise<IIntelligenceLanguageCompletion<TOutput>>;

    // #endregion
}
