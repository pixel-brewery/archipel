// #region Imports

import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import type { IIntelligenceProviderConfiguration } from '../contracts/IIntelligenceProviderConfiguration.js';

// #endregion

/**
 * Resolves provider-owned credential and endpoint fallbacks without coupling
 * the core entry point to provider-specific configuration modules.
 *
 * @internal
 */
export function resolveProviderAdapterConfiguration(
    configService: ConfigService,
    configuration: IIntelligenceProviderConfiguration,
    apiKeyKeys: ReadonlyArray<IConfigKey<string>>,
    baseUrlKeys: ReadonlyArray<IConfigKey<string>>,
    defaultBaseUrl: string | null = null,
): IIntelligenceProviderConfiguration {
    return {
        ...configuration,
        apiKey: configuration.apiKey ?? resolveFirstConfiguredValue(configService, apiKeyKeys),
        baseUrl: configuration.baseUrl ?? resolveFirstConfiguredValue(configService, baseUrlKeys) ?? defaultBaseUrl,
    };
}

function resolveFirstConfiguredValue(configService: ConfigService, keys: ReadonlyArray<IConfigKey<string>>): string | null {
    for (const key of keys) {
        const value = configService.tryGet<string | null>(key.key, null)?.trim();
        if (value) {
            return value;
        }
    }

    return null;
}
