// #region Imports

import type { IIntelligenceUsage } from './IIntelligenceUsage.js';

// #endregion

/**
 * Provider-neutral batch embedding result.
 *
 * @public
 */
export interface IIntelligenceEmbeddingBatchResult {
    // #region Properties

    readonly values: ReadonlyArray<string>;
    readonly embeddings: ReadonlyArray<ReadonlyArray<number>>;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;
    readonly usage: IIntelligenceUsage | null;

    // #endregion
}
