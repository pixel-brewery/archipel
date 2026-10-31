// #region Imports

import type { IIntelligenceUsage } from './IIntelligenceUsage.js';

// #endregion

/**
 * Provider-neutral embedding result.
 *
 * @public
 */
export interface IIntelligenceEmbeddingResult {
    // #region Properties

    readonly value: string;
    readonly embedding: ReadonlyArray<number>;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;
    readonly usage: IIntelligenceUsage | null;

    // #endregion
}
