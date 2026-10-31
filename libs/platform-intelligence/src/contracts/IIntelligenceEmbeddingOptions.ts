// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral single-value embedding options.
 *
 * @public
 */
export interface IIntelligenceEmbeddingOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly value: string;
    readonly maxRetries?: number;

    // #endregion
}
