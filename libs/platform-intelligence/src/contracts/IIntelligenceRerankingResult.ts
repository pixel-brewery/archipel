// #region Imports

import type { IntelligenceJsonValue } from './IntelligenceJsonValue.js';

// #endregion

/**
 * Provider-neutral reranking result.
 *
 * @public
 */
export interface IIntelligenceRerankingResult<TDocument extends string | Readonly<Record<string, IntelligenceJsonValue>> = string> {
    // #region Properties

    readonly ranking: ReadonlyArray<{
        readonly originalIndex: number;
        readonly score: number;
        readonly document: TDocument;
    }>;
    readonly provider: string;
    readonly model: string;

    // #endregion
}
