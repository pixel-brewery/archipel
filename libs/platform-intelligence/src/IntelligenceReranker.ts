// #region Imports

import type { JSONObject, RerankingModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceRerankingOptions } from './contracts/IIntelligenceRerankingOptions.js';
import type { IIntelligenceRerankingResult } from './contracts/IIntelligenceRerankingResult.js';
import type { IntelligenceJsonValue } from './contracts/IntelligenceJsonValue.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderError } from './errors/IntelligenceProviderError.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { isRetryableIntelligenceProviderError } from './providers/isRetryableIntelligenceProviderError.js';
import { createIntelligenceRequestSignal } from './runtime/createIntelligenceRequestSignal.js';
import { toAiSdkJsonValue, toAiSdkProviderOptions } from './runtime/toAiSdkProviderOptions.js';

// #endregion

/**
 * Provider-neutral semantic reranking facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceReranker {
    // #region Fields

    private readonly _modelResolver: IntelligenceModelResolver;

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        this._modelResolver = modelResolver;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Reranks documents by relevance to a query.
     *
     * @public
     */
    public async rerank<TDocument extends string | Readonly<Record<string, IntelligenceJsonValue>>>(
        options: IIntelligenceRerankingOptions<TDocument>,
    ): Promise<IIntelligenceRerankingResult<TDocument>> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Reranking, options.model, options.timeoutMs);

        try {
            const { rerank } = await import('ai');
            const result = await rerank({
                model: resolved.handle as RerankingModelV4,
                query: options.query,
                documents: options.documents.map((document) => (typeof document === 'string' ? document : (toAiSdkJsonValue(document) as JSONObject))),
                topN: options.topN,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                ranking: result.ranking.map((entry) => ({
                    originalIndex: entry.originalIndex,
                    score: entry.score,
                    document: options.documents[entry.originalIndex] as TDocument,
                })),
                provider: resolved.provider,
                model: resolved.model,
            };
        } catch (error: unknown) {
            throw new IntelligenceProviderError(
                'The intelligence reranking provider request failed.',
                resolved.provider,
                resolved.model,
                isRetryableIntelligenceProviderError(error),
                error instanceof Error ? error : undefined,
            );
        }
    }

    // #endregion
}
