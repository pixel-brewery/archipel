// #region Imports

import type { EmbeddingModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceEmbeddingBatchOptions } from '../contracts/IIntelligenceEmbeddingBatchOptions.js';
import type { IIntelligenceEmbeddingBatchResult } from '../contracts/IIntelligenceEmbeddingBatchResult.js';
import type { IIntelligenceEmbeddingOptions } from '../contracts/IIntelligenceEmbeddingOptions.js';
import type { IIntelligenceEmbeddingResult } from '../contracts/IIntelligenceEmbeddingResult.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderError } from '../errors/IntelligenceProviderError.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { isRetryableIntelligenceProviderError } from '../providers/isRetryableIntelligenceProviderError.js';
import { createIntelligenceRequestSignal } from '../runtime/createIntelligenceRequestSignal.js';
import { mapIntelligenceUsage } from '../runtime/mapIntelligenceUsage.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';

// #endregion

/**
 * Provider-neutral single and batch embedding facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceEmbeddingGenerator {
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
     * Embeds one text value.
     *
     * @public
     */
    public async embed(options: IIntelligenceEmbeddingOptions): Promise<IIntelligenceEmbeddingResult> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Embedding, options.model, options.timeoutMs);

        try {
            const { embed } = await import('ai');
            const result = await embed({
                model: resolved.handle as EmbeddingModelV4,
                value: options.value,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                value: result.value,
                embedding: result.embedding,
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
                usage: mapIntelligenceUsage(result.usage),
            };
        } catch (error: unknown) {
            throw this.wrapProviderError(error, resolved.provider, resolved.model);
        }
    }

    /**
     * Embeds multiple values with bounded provider parallelism.
     *
     * @public
     */
    public async embedMany(options: IIntelligenceEmbeddingBatchOptions): Promise<IIntelligenceEmbeddingBatchResult> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Embedding, options.model, options.timeoutMs);

        try {
            const { embedMany } = await import('ai');
            const result = await embedMany({
                model: resolved.handle as EmbeddingModelV4,
                values: Array.from(options.values),
                maxParallelCalls: options.maxParallelCalls,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                values: result.values,
                embeddings: result.embeddings,
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
                usage: mapIntelligenceUsage(result.usage),
            };
        } catch (error: unknown) {
            throw this.wrapProviderError(error, resolved.provider, resolved.model);
        }
    }

    private wrapProviderError(error: unknown, provider: string, model: string): IntelligenceProviderError {
        return new IntelligenceProviderError(
            'The intelligence embedding provider request failed.',
            provider,
            model,
            isRetryableIntelligenceProviderError(error),
            error instanceof Error ? error : undefined,
        );
    }

    // #endregion
}
