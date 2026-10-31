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
import { loadMiMoSdk } from './loadMiMoSdk.js';
import { MIMO_API_KEY, MIMO_BASE_URL } from './env.js';

// #endregion

/**
 * Xiaomi MiMo OpenAI-compatible language adapter.
 *
 * @public
 */
@Injectable()
export class MiMoIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
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

    public readonly provider = IntelligenceProviderNames.MiMo;
    public readonly capabilities = [IntelligenceCapabilityNames.Language] as const;

    // #endregion

    // #region Methods

    public override async load(request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        if (request.capability !== IntelligenceCapabilityNames.Language) {
            throw new IntelligenceConfigurationError(`MiMo does not support the ${request.capability} capability through this adapter.`);
        }

        const configuration = resolveProviderAdapterConfiguration(
            this._configService,
            request.configuration,
            [MIMO_API_KEY],
            [MIMO_BASE_URL],
            'https://api.xiaomimimo.com/v1',
        );
        const { createOpenAICompatible } = await loadMiMoSdk();
        const options = createProviderOptions(configuration);
        const provider = createOpenAICompatible({
            name: IntelligenceProviderNames.MiMo,
            apiKey: options.apiKey,
            baseURL: options.baseURL ?? 'https://api.xiaomimimo.com/v1',
            fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
        });

        return provider(configuration.model);
    }

    // #endregion
}
