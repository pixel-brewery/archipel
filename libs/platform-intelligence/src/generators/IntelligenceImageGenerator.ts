// #region Imports

import type { ImageModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceImageGenerationOptions } from '../contracts/IIntelligenceImageGenerationOptions.js';
import type { IIntelligenceImageGenerationResult } from '../contracts/IIntelligenceImageGenerationResult.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { createIntelligenceRequestSignal } from '../runtime/createIntelligenceRequestSignal.js';
import { mapIntelligenceGeneratedFile } from '../runtime/mapIntelligenceGeneratedFile.js';
import { mapIntelligenceImageUsage } from '../runtime/mapIntelligenceImageUsage.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';
import { IntelligenceGeneratorBase } from './abstracts/IntelligenceGeneratorBase.js';

// #endregion

/**
 * Provider-neutral image generation facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceImageGenerator extends IntelligenceGeneratorBase {
    // #region Fields

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        super(modelResolver, IntelligenceImageGenerator.name);
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Generates one or more images.
     *
     * @public
     */
    public async generate(options: IIntelligenceImageGenerationOptions): Promise<IIntelligenceImageGenerationResult> {
        const startedAt = Date.now();
        const resolved = await this.modelResolver.resolve(IntelligenceCapabilityNames.Image, options.model, options.timeoutMs);

        try {
            const { generateImage } = await import('ai');
            const result = await generateImage({
                model: resolved.handle as ImageModelV4,
                prompt:
                    typeof options.prompt === 'string'
                        ? options.prompt
                        : {
                              images: Array.from(options.prompt.images),
                              ...(options.prompt.text ? { text: options.prompt.text } : {}),
                              ...(options.prompt.mask ? { mask: options.prompt.mask } : {}),
                          },
                n: options.count,
                maxImagesPerCall: options.maxImagesPerCall,
                size: options.size,
                aspectRatio: options.aspectRatio,
                seed: options.seed,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                images: result.images.map(mapIntelligenceGeneratedFile),
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
                usage: mapIntelligenceImageUsage(result.usage, result.providerMetadata, typeof options.prompt !== 'string'),
            };
        } catch (error: unknown) {
            throw this.createProviderError(
                error,
                resolved.provider,
                resolved.model,
                IntelligenceCapabilityNames.Image,
                'image.generate',
                options.requestId,
                startedAt,
            );
        }
    }

    // #endregion
}
