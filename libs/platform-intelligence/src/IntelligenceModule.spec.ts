// #region Imports

import type { Provider } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { IntelligenceToolBase } from './abstracts/IntelligenceToolBase.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import type { IIntelligenceToolDefinition } from './contracts/IIntelligenceToolDefinition.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceValidationError } from './errors/IntelligenceValidationError.js';
import { IntelligenceEmbeddingGenerator } from './generators/IntelligenceEmbeddingGenerator.js';
import { IntelligenceImageGenerator } from './generators/IntelligenceImageGenerator.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';
import { IntelligenceSpeechGenerator } from './generators/IntelligenceSpeechGenerator.js';
import { IntelligenceTranscriptionGenerator } from './generators/IntelligenceTranscriptionGenerator.js';
import { IntelligenceVideoGenerator } from './generators/IntelligenceVideoGenerator.js';
import { IntelligenceAgentFactory } from './IntelligenceAgentFactory.js';
import { IntelligenceModule } from './IntelligenceModule.js';
import { IntelligenceProviderAssetUploader } from './IntelligenceProviderAssetUploader.js';
import { IntelligenceProviderRegistry } from './IntelligenceProviderRegistry.js';
import { IntelligenceRealtimeSessionFactory } from './IntelligenceRealtimeSessionFactory.js';
import { IntelligenceReranker } from './IntelligenceReranker.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';
import { IntelligencePromptExecutor } from './prompts/IntelligencePromptExecutor.js';
import { IntelligencePromptPolicyBase } from './prompts/abstracts/IntelligencePromptPolicyBase.js';
import type { IIntelligencePromptEffectivePolicy } from './prompts/IIntelligencePromptEffectivePolicy.js';
import type { IIntelligencePromptPolicyRequest } from './prompts/IIntelligencePromptPolicyRequest.js';
import { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import { INTELLIGENCE_DEFAULT_MODELS_TOKEN } from './tokens/IntelligenceDefaultModelsToken.js';
import { INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN } from './tokens/IntelligenceProviderAdaptersToken.js';
import { INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN } from './tokens/IntelligenceProviderRequestTimeoutToken.js';
import { INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN } from './tokens/IntelligenceRealtimeRuntimeOptionsToken.js';
import { INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN } from './tokens/IntelligenceRequestTimeoutsToken.js';
import { INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN } from './tokens/IntelligenceToolRegistryMaxToolsToken.js';

// #endregion

class EchoTool extends IntelligenceToolBase<{ readonly value: string }, { readonly value: string }> {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    public override get name(): string {
        return 'echo';
    }

    public override get tool(): IIntelligenceToolDefinition<{ readonly value: string }, { readonly value: string }> {
        return {
            description: 'Echoes a value.',
            inputSchema: z.object({ value: z.string() }),
            execute: async (input) => ({ value: input.value }),
        };
    }

    // #endregion

    // #region Methods

    // #endregion
}

class TestPromptPolicyAdapter extends IntelligencePromptPolicyBase {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public override async resolve(_request: IIntelligencePromptPolicyRequest): Promise<IIntelligencePromptEffectivePolicy> {
        return { options: {}, capabilities: [] };
    }

    // #endregion
}

class TestIntelligenceProviderAdapter extends IntelligenceProviderAdapterBase {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    public readonly provider = 'test';
    public readonly capabilities = [IntelligenceCapabilityNames.Language] as const;

    // #endregion

    // #region Methods

    public override async load(): Promise<unknown> {
        return {};
    }

    // #endregion
}

interface IToolRegistrationProvider {
    readonly inject: ReadonlyArray<unknown>;
    readonly useFactory: (registry: IntelligenceToolRegistry, ...tools: Array<EchoTool>) => Promise<boolean>;
}

function isToolRegistrationProvider(provider: Provider): provider is Provider & IToolRegistrationProvider {
    return (
        typeof provider === 'object' &&
        provider !== null &&
        'useFactory' in provider &&
        'inject' in provider &&
        Array.isArray(provider.inject) &&
        provider.inject.includes(IntelligenceToolRegistry)
    );
}

describe('IntelligenceModule', () => {
    // #region Methods

    it('should expose every provider-neutral capability facade', () => {
        // arrange

        // act
        const moduleDefinition = IntelligenceModule.register();

        // assert
        expect(moduleDefinition.exports).toEqual(
            expect.arrayContaining([
                IntelligenceProviderRegistry,
                IntelligenceToolRegistry,
                IntelligenceLanguageGenerator,
                IntelligenceEmbeddingGenerator,
                IntelligenceImageGenerator,
                IntelligenceSpeechGenerator,
                IntelligenceTranscriptionGenerator,
                IntelligenceVideoGenerator,
                IntelligenceReranker,
                IntelligenceRealtimeSessionFactory,
                IntelligenceAgentFactory,
                IntelligenceProviderAssetUploader,
                IntelligencePromptExecutor,
                IntelligencePromptPolicyBase,
            ]),
        );
    });

    it('should register one adapter registry and capability-specific defaults', () => {
        // arrange
        const defaultModels = {
            [IntelligenceCapabilityNames.Language]: { provider: 'test', model: 'test-language' },
        };

        // act
        const moduleDefinition = IntelligenceModule.register({
            providerAdapters: [TestIntelligenceProviderAdapter],
            defaultModels,
            requestTimeouts: { [IntelligenceCapabilityNames.Language]: 12_345 },
        });

        // assert
        expect(moduleDefinition.providers).toContain(TestIntelligenceProviderAdapter);
        expect(moduleDefinition.providers).toContainEqual(
            expect.objectContaining({
                provide: INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN,
                inject: [TestIntelligenceProviderAdapter],
            }),
        );
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_DEFAULT_MODELS_TOKEN,
            useValue: defaultModels,
        });
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN,
            useValue: expect.objectContaining({ language: 12_345, image: 120_000, video: 600_000 }),
        });
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN,
            useValue: 5_000,
        });
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN,
            useValue: 128,
        });
    });

    it('should reject invalid capability timeouts', () => {
        // arrange
        const action = (): unknown =>
            IntelligenceModule.register({
                requestTimeouts: { [IntelligenceCapabilityNames.Image]: 0 },
            });

        // act / assert
        expect(action).toThrow(new IntelligenceConfigurationError('Timeout for image must be a positive safe integer.'));
    });

    it('should reject invalid outbound provider request timeouts', () => {
        // arrange
        const action = (): unknown =>
            IntelligenceModule.register({
                providerRequestTimeoutMs: 0,
            });

        // act / assert
        expect(action).toThrow(new IntelligenceConfigurationError('Provider request timeout must be a positive safe integer.'));
    });

    it('should configure a bounded tool registry capacity', () => {
        // arrange

        // act
        const moduleDefinition = IntelligenceModule.register({ maxTools: 512 });

        // assert
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN,
            useValue: 512,
        });
    });

    it('should reject an invalid tool registry capacity', () => {
        // arrange
        const action = (): unknown => IntelligenceModule.register({ maxTools: 0 });

        // act / assert
        expect(action).toThrow(new IntelligenceConfigurationError('Intelligence tool registry capacity must be a positive safe integer.'));
    });

    it('should cap WebRTC termination retries at two', () => {
        // arrange

        // act
        const moduleDefinition = IntelligenceModule.register({ realtime: { terminationMaxRetries: 5 } });

        // assert
        expect(moduleDefinition.providers).toContainEqual({
            provide: INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN,
            useValue: expect.objectContaining({ terminationMaxRetries: 2 }),
        });
    });

    it('should reject a negative WebRTC termination retry count', () => {
        // arrange
        const action = (): unknown => IntelligenceModule.register({ realtime: { terminationMaxRetries: -1 } });

        // act / assert
        expect(action).toThrow(new IntelligenceValidationError('terminationMaxRetries must be a non-negative integer.'));
    });

    it('should register class-based tools and a custom prompt policy', () => {
        // arrange

        // act
        const moduleDefinition = IntelligenceModule.register({
            tools: [EchoTool],
            promptPolicyAdapter: TestPromptPolicyAdapter,
        });
        const registration = (moduleDefinition.providers ?? []).find(isToolRegistrationProvider);

        // assert
        expect(moduleDefinition.providers).toContain(EchoTool);
        expect(moduleDefinition.providers).toContain(TestPromptPolicyAdapter);
        expect(registration).toBeDefined();
    });

    it('should materialize class-based tools during module bootstrap', async () => {
        // arrange
        const moduleDefinition = IntelligenceModule.register({ tools: [EchoTool] });
        const registration = (moduleDefinition.providers ?? []).find(isToolRegistrationProvider);
        const registry = new IntelligenceToolRegistry();

        // act
        await registration?.useFactory(registry, new EchoTool());

        // assert
        expect(registry.listNames()).toEqual(['echo']);
    });

    // #endregion
});
