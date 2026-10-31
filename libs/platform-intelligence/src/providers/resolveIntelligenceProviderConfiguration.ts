// #region Imports

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type { IIntelligenceProviderConfiguration } from '../contracts/IIntelligenceProviderConfiguration.js';
import { IntelligenceProviderNames } from '../contracts/IntelligenceProviderNames.js';
import { IntelligenceConfigurationError } from '../errors/IntelligenceConfigurationError.js';
import {
    INTELLIGENCE_API_KEY,
    INTELLIGENCE_BASE_URL,
    INTELLIGENCE_MAX_OUTPUT_TOKENS,
    INTELLIGENCE_MODEL,
    INTELLIGENCE_PROVIDER,
    INTELLIGENCE_TEMPERATURE,
    INTELLIGENCE_TOP_P,
} from '../env.js';

// #endregion

interface IIntelligenceProviderConfigurationOverrides {
    readonly provider?: string;
    readonly model?: string;
}

/**
 * Resolves one provider configuration for text or realtime model loaders.
 *
 * @internal
 */
export function resolveIntelligenceProviderConfiguration(
    configService: ConfigService,
    overrides: IIntelligenceProviderConfigurationOverrides = {},
): IIntelligenceProviderConfiguration {
    const rawProvider = configService.tryGet<string | null>(INTELLIGENCE_PROVIDER.key, null);
    const provider = overrides.provider ?? normalizeProvider(rawProvider);
    const model = overrides.model ?? normalizeOptional(configService.tryGet<string | null>(INTELLIGENCE_MODEL.key, null));
    if (!model) {
        throw new IntelligenceConfigurationError('An intelligence model must be configured explicitly.');
    }

    return {
        provider,
        model,
        apiKey: normalizeOptional(configService.tryGet<string | null>(INTELLIGENCE_API_KEY.key, null)),
        baseUrl: normalizeOptional(configService.tryGet<string | null>(INTELLIGENCE_BASE_URL.key, null)),
        temperature: configService.tryGet<number>(INTELLIGENCE_TEMPERATURE.key, 0.7),
        topP: configService.tryGet<number>(INTELLIGENCE_TOP_P.key, 1),
        maxOutputTokens: configService.tryGet<number>(INTELLIGENCE_MAX_OUTPUT_TOKENS.key, 1024),
    } satisfies IIntelligenceProviderConfiguration;
}

function normalizeProvider(raw: string | null): string {
    if (!raw) {
        return IntelligenceProviderNames.OpenAI;
    }

    switch (raw.trim().toLowerCase()) {
        case 'openai':
        case 'chatgpt':
            return IntelligenceProviderNames.OpenAI;
        case 'anthropic':
        case 'claude':
            return IntelligenceProviderNames.Anthropic;
        case 'google':
        case 'gemini':
            return IntelligenceProviderNames.Google;
        case 'grok':
        case 'xai':
        case 'x-ai':
            return IntelligenceProviderNames.Grok;
        case 'mimo':
        case 'xiaomi-mimo':
            return IntelligenceProviderNames.MiMo;
        case 'gateway':
        case 'vercel':
        case 'ai-gateway':
            return IntelligenceProviderNames.Gateway;
        default:
            return raw.trim().toLowerCase();
    }
}

function normalizeOptional(value: string | null): string | null {
    if (!value) {
        return null;
    }

    const trimmed = value.trim();

    return trimmed.length === 0 ? null : trimmed;
}
