// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';

// #endregion

/**
 * Provider-neutral batch embedding options.
 *
 * @public
 */
export interface IIntelligenceEmbeddingBatchOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly values: ReadonlyArray<string>;
    readonly maxRetries?: number;
    readonly maxParallelCalls?: number;

    // #endregion
}
