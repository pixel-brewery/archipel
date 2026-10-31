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
import { loadGrokSdk } from './loadGrokSdk.js';
import { GROK_API_KEY, GROK_BASE_URL, XAI_API_KEY, XAI_BASE_URL } from './env.js';

// #endregion

/**
 * xAI Grok adapter for language, image, speech, transcription, video, realtime, and files.
 *
 * @public
 */
@Injectable()
export class GrokIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
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

    public readonly provider = IntelligenceProviderNames.Grok;
    public readonly capabilities = [
        IntelligenceCapabilityNames.Language,
        IntelligenceCapabilityNames.Image,
        IntelligenceCapabilityNames.Speech,
        IntelligenceCapabilityNames.Transcription,
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
            [GROK_API_KEY, XAI_API_KEY],
            [GROK_BASE_URL, XAI_BASE_URL],
            'https://api.x.ai/v1',
        );
        const { createXai } = await loadGrokSdk();
        const provider = createXai({
            ...createProviderOptions(configuration),
            fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
        });
        const model = configuration.model;

        switch (request.capability) {
            case IntelligenceCapabilityNames.Language:
                return provider(model);
            case IntelligenceCapabilityNames.Image:
                return provider.image(model);
            case IntelligenceCapabilityNames.Speech:
                return provider.speech();
            case IntelligenceCapabilityNames.Transcription:
                return provider.transcription();
            case IntelligenceCapabilityNames.Video:
                return provider.video(model);
            case IntelligenceCapabilityNames.Realtime:
                return provider.experimental_realtime(model);
            case IntelligenceCapabilityNames.Files:
                return provider.files();
            default:
                throw new IntelligenceConfigurationError(`Grok does not support the ${request.capability} capability through this adapter.`);
        }
    }

    // #endregion
}
