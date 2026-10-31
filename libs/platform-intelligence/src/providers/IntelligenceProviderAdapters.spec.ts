// #region Imports

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { describe, expect, it } from 'vitest';
import type { IntelligenceCapability } from '../contracts/IntelligenceCapability.js';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import type { IIntelligenceProviderConfiguration } from '../contracts/IIntelligenceProviderConfiguration.js';
import type { IntelligenceProviderAdapterBase } from './abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from './IIntelligenceProviderLoadRequest.js';
import { AnthropicIntelligenceProviderAdapter } from './anthropic/AnthropicIntelligenceProviderAdapter.js';
import { GatewayIntelligenceProviderAdapter } from './gateway/GatewayIntelligenceProviderAdapter.js';
import { GoogleIntelligenceProviderAdapter } from './google/GoogleIntelligenceProviderAdapter.js';
import { GrokIntelligenceProviderAdapter } from './grok/GrokIntelligenceProviderAdapter.js';
import { MiMoIntelligenceProviderAdapter } from './mimo/MiMoIntelligenceProviderAdapter.js';
import { OpenAIIntelligenceProviderAdapter } from './openai/OpenAIIntelligenceProviderAdapter.js';

// #endregion

// #region Types

interface IProviderAdapterCase {
    readonly adapter: IntelligenceProviderAdapterBase;
    readonly name: string;
}

// #endregion

// #region Constants

const PROVIDER_ADAPTERS: ReadonlyArray<IProviderAdapterCase> = [
    { name: 'OpenAI', adapter: new OpenAIIntelligenceProviderAdapter(createConfigService()) },
    { name: 'Anthropic', adapter: new AnthropicIntelligenceProviderAdapter(createConfigService()) },
    { name: 'Google', adapter: new GoogleIntelligenceProviderAdapter(createConfigService()) },
    { name: 'Grok', adapter: new GrokIntelligenceProviderAdapter(createConfigService()) },
    { name: 'MiMo', adapter: new MiMoIntelligenceProviderAdapter(createConfigService()) },
    { name: 'Gateway', adapter: new GatewayIntelligenceProviderAdapter(createConfigService()) },
];

// #endregion

// #region Methods

function createConfiguration(provider: string): IIntelligenceProviderConfiguration {
    return {
        provider,
        model: 'test-model',
        apiKey: 'test-key',
        baseUrl: null,
        temperature: 0.7,
        topP: 1,
        maxOutputTokens: 1_024,
    };
}

function createConfigService(): ConfigService {
    return {
        tryGet: <TValue>(_key: string, fallback: TValue): TValue => fallback,
    } as unknown as ConfigService;
}

function createRequest(adapter: IntelligenceProviderAdapterBase, capability: IntelligenceCapability): IIntelligenceProviderLoadRequest {
    return {
        capability,
        configuration: createConfiguration(adapter.provider),
        operationTimeoutMs: 1_000,
        providerRequestTimeoutMs: 1_000,
    };
}

// #endregion

describe('intelligence provider adapters', () => {
    // #region Methods

    it.each(PROVIDER_ADAPTERS)('$name should materialize every declared capability without a remote call', async ({ adapter }) => {
        // arrange
        const requests = adapter.capabilities.map((capability) => createRequest(adapter, capability));

        // act
        const handles = await Promise.all(requests.map((request) => adapter.load(request)));

        // assert
        expect(handles).toHaveLength(adapter.capabilities.length);
        expect(handles.every((handle) => handle !== null && handle !== undefined)).toBe(true);
    });

    it('should reject a capability the provider does not declare', async () => {
        // arrange
        const adapter = new MiMoIntelligenceProviderAdapter(createConfigService());
        const request = createRequest(adapter, IntelligenceCapabilityNames.Image);

        // act
        const action = adapter.load(request);

        // assert
        await expect(action).rejects.toThrow('MiMo does not support the image capability');
    });

    // #endregion
});
