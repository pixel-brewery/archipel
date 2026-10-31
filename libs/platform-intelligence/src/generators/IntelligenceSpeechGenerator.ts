// #region Imports

import type { SpeechModelV4 } from '@ai-sdk/provider';
import { Injectable } from '@nestjs/common';
import type { IIntelligenceSpeechGenerationOptions } from '../contracts/IIntelligenceSpeechGenerationOptions.js';
import type { IIntelligenceSpeechGenerationResult } from '../contracts/IIntelligenceSpeechGenerationResult.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceModelResolver } from '../IntelligenceModelResolver.js';
import { createIntelligenceRequestSignal } from '../runtime/createIntelligenceRequestSignal.js';
import { mapIntelligenceGeneratedFile } from '../runtime/mapIntelligenceGeneratedFile.js';
import { mapIntelligenceWarnings } from '../runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from '../runtime/toAiSdkProviderOptions.js';
import { IntelligenceGeneratorBase } from './abstracts/IntelligenceGeneratorBase.js';

// #endregion

/**
 * Provider-neutral speech generation facade.
 *
 * @public
 */
@Injectable()
export class IntelligenceSpeechGenerator extends IntelligenceGeneratorBase {
    // #region Fields

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        super(modelResolver, IntelligenceSpeechGenerator.name);
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Generates spoken audio from text.
     *
     * @public
     */
    public async generate(options: IIntelligenceSpeechGenerationOptions): Promise<IIntelligenceSpeechGenerationResult> {
        const startedAt = Date.now();
        const resolved = await this.modelResolver.resolve(IntelligenceCapabilityNames.Speech, options.model, options.timeoutMs);

        try {
            const { generateSpeech } = await import('ai');
            const result = await generateSpeech({
                model: resolved.handle as SpeechModelV4,
                text: options.text,
                voice: options.voice,
                outputFormat: options.outputFormat,
                instructions: options.instructions,
                speed: options.speed,
                language: options.language,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
                maxRetries: options.maxRetries ?? 2,
                abortSignal: createIntelligenceRequestSignal(resolved.timeoutMs, options.abortSignal),
                headers: options.headers ? { ...options.headers } : undefined,
            });

            return {
                audio: mapIntelligenceGeneratedFile(result.audio),
                provider: resolved.provider,
                model: resolved.model,
                warnings: mapIntelligenceWarnings(result.warnings),
            };
        } catch (error: unknown) {
            throw this.createProviderError(
                error,
                resolved.provider,
                resolved.model,
                IntelligenceCapabilityNames.Speech,
                'speech.generate',
                options.requestId,
                startedAt,
            );
        }
    }

    // #endregion
}
