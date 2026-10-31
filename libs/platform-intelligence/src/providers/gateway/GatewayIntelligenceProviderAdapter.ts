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
import { loadGatewaySdk } from './loadGatewaySdk.js';
import { AI_GATEWAY_API_KEY, AI_GATEWAY_BASE_URL } from './env.js';

// #endregion

/**
 * Vercel AI Gateway adapter spanning all standardized model capabilities.
 *
 * @public
 */
@Injectable()
export class GatewayIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
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

    public readonly provider = IntelligenceProviderNames.Gateway;
    public readonly capabilities = [
        IntelligenceCapabilityNames.Language,
        IntelligenceCapabilityNames.Embedding,
        IntelligenceCapabilityNames.Image,
        IntelligenceCapabilityNames.Speech,
        IntelligenceCapabilityNames.Transcription,
        IntelligenceCapabilityNames.Video,
        IntelligenceCapabilityNames.Reranking,
        IntelligenceCapabilityNames.Realtime,
    ] as const;

    // #endregion

    // #region Methods

    public override async load(request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        const configuration = resolveProviderAdapterConfiguration(this._configService, request.configuration, [AI_GATEWAY_API_KEY], [AI_GATEWAY_BASE_URL]);
        const { createGateway } = await loadGatewaySdk();
        const provider = createGateway({
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
            case IntelligenceCapabilityNames.Transcription:
                return provider.transcription(model);
            case IntelligenceCapabilityNames.Video:
                return provider.video(model);
            case IntelligenceCapabilityNames.Reranking:
                return provider.reranking(model);
            case IntelligenceCapabilityNames.Realtime:
                return provider.experimental_realtime(model);
            default:
                throw new IntelligenceConfigurationError(`AI Gateway does not support the ${request.capability} capability through this adapter.`);
        }
    }

    // #endregion
}
