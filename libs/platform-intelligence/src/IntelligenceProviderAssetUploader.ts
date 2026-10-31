// #region Imports

import { Injectable } from '@nestjs/common';
import type { FilesV4, SkillsV4 } from '@ai-sdk/provider';
import type { IIntelligenceFileUploadOptions } from './contracts/IIntelligenceFileUploadOptions.js';
import type { IIntelligenceFileUploadResult } from './contracts/IIntelligenceFileUploadResult.js';
import type { IIntelligenceSkillUploadOptions } from './contracts/IIntelligenceSkillUploadOptions.js';
import type { IIntelligenceSkillUploadResult } from './contracts/IIntelligenceSkillUploadResult.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderError } from './errors/IntelligenceProviderError.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { isRetryableIntelligenceProviderError } from './providers/isRetryableIntelligenceProviderError.js';
import { mapIntelligenceWarnings } from './runtime/mapIntelligenceWarnings.js';
import { toAiSdkProviderOptions } from './runtime/toAiSdkProviderOptions.js';

// #endregion

/**
 * Uploads provider-managed files and skills behind provider-neutral contracts.
 *
 * @public
 */
@Injectable()
export class IntelligenceProviderAssetUploader {
    // #region Fields

    private readonly _modelResolver: IntelligenceModelResolver;

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        this._modelResolver = modelResolver;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Uploads a provider-managed file.
     *
     * @public
     * @param options - Provider-neutral file upload options.
     * @returns A normalized provider reference.
     */
    public async uploadFile(options: IIntelligenceFileUploadOptions): Promise<IIntelligenceFileUploadResult> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Files, options.model, options.timeoutMs);

        try {
            const { uploadFile } = await import('ai');
            const result = await uploadFile({
                api: resolved.handle as FilesV4,
                data: options.data,
                mediaType: options.mediaType,
                filename: options.filename,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
            });

            return {
                providerReference: result.providerReference,
                provider: resolved.provider,
                ...(result.mediaType ? { mediaType: result.mediaType } : {}),
                ...(result.filename ? { filename: result.filename } : {}),
                warnings: mapIntelligenceWarnings(result.warnings),
            };
        } catch (error: unknown) {
            throw this.wrapProviderError(error, resolved.provider, resolved.model, IntelligenceCapabilityNames.Files);
        }
    }

    /**
     * Uploads a provider-managed skill.
     *
     * @public
     * @param options - Provider-neutral skill upload options.
     * @returns A normalized provider reference and skill metadata.
     */
    public async uploadSkill(options: IIntelligenceSkillUploadOptions): Promise<IIntelligenceSkillUploadResult> {
        const resolved = await this._modelResolver.resolve(IntelligenceCapabilityNames.Skills, options.model, options.timeoutMs);

        try {
            const { uploadSkill } = await import('ai');
            const result = await uploadSkill({
                api: resolved.handle as SkillsV4,
                files: options.files.map((file) => ({
                    path: file.path,
                    data: file.data,
                })),
                displayTitle: options.displayTitle,
                providerOptions: toAiSdkProviderOptions(options.providerOptions),
            });

            return {
                providerReference: result.providerReference,
                provider: resolved.provider,
                ...(result.displayTitle ? { displayTitle: result.displayTitle } : {}),
                ...(result.name ? { name: result.name } : {}),
                ...(result.description ? { description: result.description } : {}),
                ...(result.latestVersion ? { latestVersion: result.latestVersion } : {}),
                warnings: mapIntelligenceWarnings(result.warnings),
            };
        } catch (error: unknown) {
            throw this.wrapProviderError(error, resolved.provider, resolved.model, IntelligenceCapabilityNames.Skills);
        }
    }

    private wrapProviderError(error: unknown, provider: string, model: string, operation: string): IntelligenceProviderError {
        return new IntelligenceProviderError(
            `The intelligence ${operation} provider request failed.`,
            provider,
            model,
            isRetryableIntelligenceProviderError(error),
            error instanceof Error ? error : undefined,
        );
    }

    // #endregion
}
