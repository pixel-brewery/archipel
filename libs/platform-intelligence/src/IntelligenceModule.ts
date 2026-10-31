// #region Imports

import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, type InjectionToken, Module, type Provider, type Type } from '@nestjs/common';
import type { IntelligenceCapability } from './contracts/IntelligenceCapability.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { PLATFORM_INTELLIGENCE_CONFIG_ENTRIES } from './env.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceEmbeddingGenerator } from './generators/IntelligenceEmbeddingGenerator.js';
import { IntelligenceImageGenerator } from './generators/IntelligenceImageGenerator.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';
import { IntelligenceSpeechGenerator } from './generators/IntelligenceSpeechGenerator.js';
import { IntelligenceTranscriptionGenerator } from './generators/IntelligenceTranscriptionGenerator.js';
import { IntelligenceVideoGenerator } from './generators/IntelligenceVideoGenerator.js';
import { IntelligenceAgentFactory } from './IntelligenceAgentFactory.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { IntelligenceProviderAssetUploader } from './IntelligenceProviderAssetUploader.js';
import { IntelligenceProviderDiagnostics } from './IntelligenceProviderDiagnostics.js';
import { IntelligenceProviderRegistry } from './IntelligenceProviderRegistry.js';
import { IntelligenceRealtimeSessionFactory } from './IntelligenceRealtimeSessionFactory.js';
import { IntelligenceReranker } from './IntelligenceReranker.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';
import type { IIntelligenceModuleOptions } from './interfaces/IIntelligenceModuleOptions.js';
import type { IIntelligenceTool } from './interfaces/IIntelligenceTool.js';
import type { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import { DefaultIntelligencePromptPolicyAdapter } from './prompts/DefaultIntelligencePromptPolicyAdapter.js';
import { IntelligencePromptExecutor } from './prompts/IntelligencePromptExecutor.js';
import { IntelligencePromptPolicyBase } from './prompts/abstracts/IntelligencePromptPolicyBase.js';
import { NoopIntelligenceRealtimeMeteringAdapter } from './realtime/adapters/NoopIntelligenceRealtimeMeteringAdapter.js';
import { createIntelligenceRealtimeRuntimeOptions } from './realtime/createIntelligenceRealtimeRuntimeOptions.js';
import { IntelligenceRealtimeMeteringBase } from './realtime/abstracts/IntelligenceRealtimeMeteringBase.js';
import { INTELLIGENCE_DEFAULT_MODELS_TOKEN } from './tokens/IntelligenceDefaultModelsToken.js';
import { INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN } from './tokens/IntelligenceProviderAdaptersToken.js';
import { INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN } from './tokens/IntelligenceProviderRequestTimeoutToken.js';
import { INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN } from './tokens/IntelligenceRealtimeRuntimeOptionsToken.js';
import { INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN } from './tokens/IntelligenceRequestTimeoutsToken.js';
import { INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN } from './tokens/IntelligenceToolRegistryMaxToolsToken.js';

// #endregion

// #region Types

type IntelligenceToolProvider = NonNullable<IIntelligenceModuleOptions['tools']>[number];

type IntelligenceToolInstance = IIntelligenceTool | Promise<IIntelligenceTool>;

type IntelligenceToolProviderDefinition = Exclude<IntelligenceToolProvider, IntelligenceToolInstance>;

type IntelligenceToolRegistration =
    | {
          readonly kind: 'instance';
          readonly tool: IntelligenceToolInstance;
      }
    | {
          readonly kind: 'provider';
          readonly provider: IntelligenceToolProviderDefinition;
      };

// #endregion

// #region Constants

const INTELLIGENCE_TOOL_REGISTRATION = Symbol('INTELLIGENCE_TOOL_REGISTRATION');
const DEFAULT_TOOL_REGISTRY_MAX_TOOLS = 128;
const DEFAULT_PROVIDER_REQUEST_TIMEOUT_MS = 5_000;
const DEFAULT_REQUEST_TIMEOUTS: Readonly<Record<IntelligenceCapability, number>> = Object.freeze({
    [IntelligenceCapabilityNames.Language]: 30_000,
    [IntelligenceCapabilityNames.Embedding]: 10_000,
    [IntelligenceCapabilityNames.Image]: 120_000,
    [IntelligenceCapabilityNames.Speech]: 60_000,
    [IntelligenceCapabilityNames.Transcription]: 120_000,
    [IntelligenceCapabilityNames.Video]: 600_000,
    [IntelligenceCapabilityNames.Reranking]: 30_000,
    [IntelligenceCapabilityNames.Realtime]: 5_000,
    [IntelligenceCapabilityNames.Files]: 60_000,
    [IntelligenceCapabilityNames.Skills]: 120_000,
});

// #endregion

/**
 * Core module exposing the shared intelligence infrastructure.
 *
 * @public
 */
@Module({})
export class IntelligenceModule {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Registers the intelligence module and optional class-based tools.
     *
     * @param options - Intelligence module configuration.
     * @returns A configured dynamic module definition.
     *
     * @public
     */
    public static register(options: IIntelligenceModuleOptions = {}): DynamicModule {
        const providerAdapters = Array.from(options.providerAdapters ?? []);
        const toolRegistrations = IntelligenceModule.createToolRegistrations(options.tools ?? []);
        const toolProviders = toolRegistrations.flatMap((registration) => (registration.kind === 'provider' ? [registration.provider] : []));
        const realtimeMeteringProviders = IntelligenceModule.createRealtimeMeteringProviders(options);
        const promptPolicyProviders = IntelligenceModule.createPromptPolicyProviders(options);

        return {
            module: IntelligenceModule,
            global: options.isGlobal ?? false,
            imports: [ConfigModule.register('platform-intelligence', [...PLATFORM_INTELLIGENCE_CONFIG_ENTRIES, ...(options.configEntries ?? [])])],
            providers: [
                ...providerAdapters,
                IntelligenceModule.createProviderAdaptersProvider(providerAdapters),
                {
                    provide: INTELLIGENCE_DEFAULT_MODELS_TOKEN,
                    useValue: Object.freeze({ ...(options.defaultModels ?? {}) }),
                },
                {
                    provide: INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN,
                    useValue: IntelligenceModule.resolveRequestTimeouts(options.requestTimeouts),
                },
                {
                    provide: INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN,
                    useValue: IntelligenceModule.resolveProviderRequestTimeout(options.providerRequestTimeoutMs),
                },
                {
                    provide: INTELLIGENCE_REALTIME_RUNTIME_OPTIONS_TOKEN,
                    useValue: createIntelligenceRealtimeRuntimeOptions(options.realtime),
                },
                {
                    provide: INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN,
                    useValue: IntelligenceModule.resolveToolRegistryMaxTools(options.maxTools),
                },
                ...realtimeMeteringProviders,
                IntelligenceToolRegistry,
                IntelligenceProviderRegistry,
                IntelligenceModelResolver,
                IntelligenceLanguageGenerator,
                IntelligenceRealtimeSessionFactory,
                IntelligenceAgentFactory,
                IntelligenceEmbeddingGenerator,
                IntelligenceImageGenerator,
                IntelligenceSpeechGenerator,
                IntelligenceTranscriptionGenerator,
                IntelligenceVideoGenerator,
                IntelligenceReranker,
                IntelligenceProviderAssetUploader,
                IntelligenceProviderDiagnostics,
                IntelligencePromptExecutor,
                ...promptPolicyProviders,
                ...toolProviders,
                IntelligenceModule.createToolRegistrationProvider(toolRegistrations),
            ],
            exports: [
                IntelligenceToolRegistry,
                IntelligenceProviderRegistry,
                IntelligenceLanguageGenerator,
                IntelligenceRealtimeSessionFactory,
                IntelligenceAgentFactory,
                IntelligenceEmbeddingGenerator,
                IntelligenceImageGenerator,
                IntelligenceSpeechGenerator,
                IntelligenceTranscriptionGenerator,
                IntelligenceVideoGenerator,
                IntelligenceReranker,
                IntelligenceProviderAssetUploader,
                IntelligenceProviderDiagnostics,
                IntelligencePromptExecutor,
                IntelligencePromptPolicyBase,
            ],
        };
    }

    private static createToolRegistrations(toolProviders: ReadonlyArray<IntelligenceToolProvider>): ReadonlyArray<IntelligenceToolRegistration> {
        return toolProviders.map((provider) => {
            if (IntelligenceModule.isToolInstance(provider)) {
                return {
                    kind: 'instance',
                    tool: provider,
                };
            }

            return {
                kind: 'provider',
                provider: provider,
            };
        });
    }

    private static createProviderAdaptersProvider(providerAdapters: ReadonlyArray<Type<IntelligenceProviderAdapterBase>>): Provider {
        return {
            provide: INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN,
            useFactory: (...adapters: ReadonlyArray<IntelligenceProviderAdapterBase>): ReadonlyArray<IntelligenceProviderAdapterBase> =>
                Object.freeze(adapters),
            inject: Array.from(providerAdapters),
        };
    }

    private static resolveRequestTimeouts(overrides: IIntelligenceModuleOptions['requestTimeouts']): Readonly<Record<IntelligenceCapability, number>> {
        const timeouts = {
            ...DEFAULT_REQUEST_TIMEOUTS,
            ...(overrides ?? {}),
        };

        for (const [capability, timeoutMs] of Object.entries(timeouts)) {
            if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) {
                throw new IntelligenceConfigurationError(`Timeout for ${capability} must be a positive safe integer.`);
            }
        }

        return Object.freeze(timeouts);
    }

    private static resolveProviderRequestTimeout(timeoutMs: number | undefined): number {
        const resolved = timeoutMs ?? DEFAULT_PROVIDER_REQUEST_TIMEOUT_MS;
        if (!Number.isSafeInteger(resolved) || resolved < 1) {
            throw new IntelligenceConfigurationError('Provider request timeout must be a positive safe integer.');
        }

        return resolved;
    }

    private static resolveToolRegistryMaxTools(maxTools: number | undefined): number {
        const resolved = maxTools ?? DEFAULT_TOOL_REGISTRY_MAX_TOOLS;
        if (!Number.isSafeInteger(resolved) || resolved < 1) {
            throw new IntelligenceConfigurationError('Intelligence tool registry capacity must be a positive safe integer.');
        }

        return resolved;
    }

    private static createRealtimeMeteringProviders(options: IIntelligenceModuleOptions): ReadonlyArray<Provider> {
        const adapter = options.realtime?.meteringAdapter;
        if (!adapter) {
            return [
                NoopIntelligenceRealtimeMeteringAdapter,
                {
                    provide: IntelligenceRealtimeMeteringBase,
                    useExisting: NoopIntelligenceRealtimeMeteringAdapter,
                },
            ];
        }

        if (typeof adapter === 'function') {
            return [
                adapter,
                {
                    provide: IntelligenceRealtimeMeteringBase,
                    useExisting: adapter,
                },
            ];
        }

        return [
            {
                provide: IntelligenceRealtimeMeteringBase,
                useValue: adapter,
            },
        ];
    }

    private static createPromptPolicyProviders(options: IIntelligenceModuleOptions): ReadonlyArray<Provider> {
        const adapter = options.promptPolicyAdapter ?? DefaultIntelligencePromptPolicyAdapter;

        return [
            adapter,
            {
                provide: IntelligencePromptPolicyBase,
                useExisting: adapter,
            },
        ];
    }

    private static createToolRegistrationProvider(toolRegistrations: ReadonlyArray<IntelligenceToolRegistration>): Provider {
        const providerRegistrations = toolRegistrations.filter((registration) => registration.kind === 'provider');

        return {
            provide: INTELLIGENCE_TOOL_REGISTRATION,
            useFactory: async (registry: IntelligenceToolRegistry, ...tools: Array<IIntelligenceTool>): Promise<boolean> => {
                let providerIndex = 0;

                for (const registration of toolRegistrations) {
                    const tool = registration.kind === 'instance' ? await registration.tool : tools[providerIndex++];

                    registry.register(tool);
                }

                return true;
            },
            inject: [
                IntelligenceToolRegistry,
                ...providerRegistrations.map((registration) => IntelligenceModule.resolveToolProviderToken(registration.provider)),
            ],
        };
    }

    private static isToolInstance(provider: IntelligenceToolProvider): provider is IntelligenceToolInstance {
        if (IntelligenceModule.isToolPromise(provider)) {
            return true;
        }

        if (typeof provider !== 'object' || provider === null || 'provide' in provider) {
            return false;
        }

        const candidate = provider as unknown as Record<string, unknown>;

        return typeof candidate['name'] === 'string' && 'tool' in candidate;
    }

    private static isToolPromise(provider: IntelligenceToolProvider): provider is Promise<IIntelligenceTool> {
        if (typeof provider !== 'object' || provider === null) {
            return false;
        }

        const candidate = provider as unknown as Record<string, unknown>;

        return typeof candidate['then'] === 'function';
    }

    private static resolveToolProviderToken(provider: IntelligenceToolProviderDefinition): InjectionToken {
        if (typeof provider === 'function') {
            return provider;
        }

        return provider.provide;
    }

    // #endregion
}
