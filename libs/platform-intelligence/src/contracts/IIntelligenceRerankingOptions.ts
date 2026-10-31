// #region Imports

import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';
import type { IntelligenceJsonValue } from './IntelligenceJsonValue.js';

// #endregion

/**
 * Provider-neutral reranking options.
 *
 * @public
 */
export interface IIntelligenceRerankingOptions<
    TDocument extends string | Readonly<Record<string, IntelligenceJsonValue>> = string,
> extends IIntelligenceRequestOptions {
    // #region Properties

    readonly query: string;
    readonly documents: ReadonlyArray<TDocument>;
    readonly maxRetries?: number;
    readonly topN?: number;

    // #endregion
}
