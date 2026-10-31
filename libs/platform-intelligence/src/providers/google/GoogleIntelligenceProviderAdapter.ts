// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { IntelligenceCapabilityNames } from '../../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderNames } from '../../contracts/IntelligenceProviderNames.js';
import { IntelligenceConfigurationError } from '../../errors/IntelligenceConfigurationError.js';
import { createProviderOptions } from '../createProviderOptions.js';
import { IntelligenceProviderAdapterBase } from '../abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from '../IIntelligenceProviderLoadRequest.js';
import { resolveProviderAdapterConfiguration } from '../resolveProviderAdapterConfiguration.js';
import { createIntelligenceTimeoutFetch } from '../../runtime/createIntelligenceTimeoutFetch.js';
import { loadGoogleSdk } from './loadGoogleSdk.js';
import { GEMINI_API_KEY, GOOGLE_API_KEY, GOOGLE_BASE_URL } from './env.js';

// #endregion

/**
 * Google adapter for language, embeddings, images, speech, video, realtime, and files.
 *
 * @public
 */
@Injectable()
export class GoogleIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
    // #region Fields

    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Properties

    public readonly provider = IntelligenceProviderNames.Google;
    public readonly capabilities = [
        IntelligenceCapabilityNames.Language,
        IntelligenceCapabilityNames.Embedding,
        IntelligenceCapabilityNames.Image,
        IntelligenceCapabilityNames.Speech,
        IntelligenceCapabilityNames.Video,
        IntelligenceCapabilityNames.Realtime,
        IntelligenceCapabilityNames.Files,
    ] as const;

    // #endregion

    // #region Methods

    public override async load(request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        const configuration = resolveProviderAdapterConfiguration(
            this._configService,
            request.configuration,
            [GOOGLE_API_KEY, GEMINI_API_KEY],
            [GOOGLE_BASE_URL],
        );
        const { createGoogleGenerativeAI } = await loadGoogleSdk();
        const provider = createGoogleGenerativeAI({
            ...createProviderOptions(configuration),
            fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
        });
        const model = configuration.model;

        switch (request.capability) {
            case IntelligenceCapabilityNames.Language:
                return provider(model);
            case IntelligenceCapabilityNames.Embedding:
                return provider.embedding(model);
            case IntelligenceCapabilityNames.Image:
                return provider.image(model);
            case IntelligenceCapabilityNames.Speech:
                return provider.speech(model);
            case IntelligenceCapabilityNames.Video:
                return provider.video(model);
            case IntelligenceCapabilityNames.Realtime:
                return provider.experimental_realtime(model);
            case IntelligenceCapabilityNames.Files:
                return provider.files();
            default:
                throw new IntelligenceConfigurationError(`Google does not support the ${request.capability} capability through this adapter.`);
        }
    }

    // #endregion
}
