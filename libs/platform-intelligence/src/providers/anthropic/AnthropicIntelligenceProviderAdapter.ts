// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { IntelligenceCapabilityNames } from '../../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderNames } from '../../contracts/IntelligenceProviderNames.js';
import { IntelligenceConfigurationError } from '../../errors/IntelligenceConfigurationError.js';
import { createProviderOptions } from '../createProviderOptions.js';
import type { IIntelligenceProviderLoadRequest } from '../IIntelligenceProviderLoadRequest.js';
import { IntelligenceProviderAdapterBase } from '../abstracts/IntelligenceProviderAdapterBase.js';
import { resolveProviderAdapterConfiguration } from '../resolveProviderAdapterConfiguration.js';
import { createIntelligenceTimeoutFetch } from '../../runtime/createIntelligenceTimeoutFetch.js';
import { loadAnthropicSdk } from './loadAnthropicSdk.js';
import { ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL } from './env.js';

// #endregion

/**
 * Anthropic adapter for language, files, and skills.
 *
 * @public
 */
@Injectable()
export class AnthropicIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
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

    public readonly provider = IntelligenceProviderNames.Anthropic;

    public readonly capabilities = [IntelligenceCapabilityNames.Language, IntelligenceCapabilityNames.Files, IntelligenceCapabilityNames.Skills] as const;

    // #endregion

    // #region Methods

    public override async load(request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        const configuration = resolveProviderAdapterConfiguration(this._configService, request.configuration, [ANTHROPIC_API_KEY], [ANTHROPIC_BASE_URL]);
        const { createAnthropic } = await loadAnthropicSdk();
        const provider = createAnthropic({
            ...createProviderOptions(configuration),
            fetch: createIntelligenceTimeoutFetch(request.providerRequestTimeoutMs),
        });

        switch (request.capability) {
            case IntelligenceCapabilityNames.Language:
                return provider(configuration.model);
            case IntelligenceCapabilityNames.Files:
                return provider.files();
            case IntelligenceCapabilityNames.Skills:
                return provider.skills();
            default:
                throw new IntelligenceConfigurationError(`Anthropic does not support the ${request.capability} capability through this adapter.`);
        }
    }

    // #endregion
}
