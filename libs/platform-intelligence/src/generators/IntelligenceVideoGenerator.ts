// #region Imports

import type { Experimental_VideoModelV4 as VideoModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceVideoGenerationOptions } from '../contracts/IIntelligenceVideoGenerationOptions.js';
import type { IIntelligenceVideoGenerationResult } from '../contracts/IIntelligenceVideoGenerationResult.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { createIntelligenceRequestSignal } from '../runtime/createIntelligenceRequestSignal.js';
import { mapIntelligenceGeneratedFile } from '../runtime/mapIntelligenceGeneratedFile.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';
import { IntelligenceGeneratorBase } from './abstracts/IntelligenceGeneratorBase.js';

// #endregion

/**
 * Provider-neutral video generation facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceVideoGenerator extends IntelligenceGeneratorBase {
    // #region Fields

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        super(modelResolver, IntelligenceVideoGenerator.name);
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Generates one or more videos.
     *
     * @public
     */
    public async generate(options: IIntelligenceVideoGenerationOptions): Promise<IIntelligenceVideoGenerationResult> {
        const startedAt = Date.now();
        const resolved = await this.modelResolver.resolve(IntelligenceCapabilityNames.Video, options.model, options.timeoutMs);

        try {
            const { experimental_generateVideo: generateVideo } = await import('ai');
            const result = await generateVideo({
                model: resolved.handle as VideoModelV4,
                prompt: options.prompt,
                n: options.count,
                maxVideosPerCall: options.maxVideosPerCall,
                aspectRatio: options.aspectRatio,
                resolution: options.resolution,
                duration: options.durationSeconds,
                fps: options.framesPerSecond,
                seed: options.seed,
                frameImages: options.frameImages ? Array.from(options.frameImages) : undefined,
                inputReferences: options.inputReferences ? Array.from(options.inputReferences) : undefined,
                generateAudio: options.generateAudio,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                videos: result.videos.map(mapIntelligenceGeneratedFile),
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
            };
        } catch (error: unknown) {
            throw this.createProviderError(
                error,
                resolved.provider,
                resolved.model,
                IntelligenceCapabilityNames.Video,
                'video.generate',
                options.requestId,
                startedAt,
            );
        }
    }

    // #endregion
}
