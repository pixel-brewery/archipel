// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Inject, Injectable } from '@nestjs/common';
import type { IIntelligenceModelReference } from './contracts/IIntelligenceModelReference.js';
import type { IIntelligenceProviderConfiguration } from './contracts/IIntelligenceProviderConfiguration.js';
import type { IntelligenceCapability } from './contracts/IntelligenceCapability.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceProviderRegistry } from './IntelligenceProviderRegistry.js';
import type { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from './providers/IIntelligenceProviderLoadRequest.js';
import { resolveIntelligenceProviderConfiguration } from './providers/resolveIntelligenceProviderConfiguration.js';
import { INTELLIGENCE_DEFAULT_MODELS_TOKEN } from './tokens/IntelligenceDefaultModelsToken.js';
import { INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN } from './tokens/IntelligenceProviderRequestTimeoutToken.js';
import { INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN } from './tokens/IntelligenceRequestTimeoutsToken.js';

// #endregion

// #region Types

interface IResolvedIntelligenceModel {
    readonly handle: unknown;
    readonly provider: string;
    readonly model: string;
    readonly timeoutMs: number;
}

interface IResolvedIntelligenceProviderRequest {
    readonly adapter: IntelligenceProviderAdapterBase;
    readonly request: IIntelligenceProviderLoadRequest;
}

// #endregion

/**
 * Resolves provider-neutral model references into opaque provider handles.
 *
 * @internal
 */
@Injectable()
export class IntelligenceModelResolver {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _defaultModels: Readonly<Partial<Record<IntelligenceCapability, IIntelligenceModelReference>>>;
    private readonly _providerRequestTimeoutMs: number;
    private readonly _registry: IntelligenceProviderRegistry;
    private readonly _requestTimeouts: Readonly<Record<IntelligenceCapability, number>>;

    // #endregion

    // #region Ctor

    public constructor(
        configService: ConfigService,
        registry: IntelligenceProviderRegistry,
        @Inject(INTELLIGENCE_DEFAULT_MODELS_TOKEN)
        defaultModels: Readonly<Partial<Record<IntelligenceCapability, IIntelligenceModelReference>>>,
        @Inject(INTELLIGENCE_REQUEST_TIMEOUTS_TOKEN) requestTimeouts: Readonly<Record<IntelligenceCapability, number>>,
        @Inject(INTELLIGENCE_PROVIDER_REQUEST_TIMEOUT_TOKEN) providerRequestTimeoutMs: number,
    ) {
        this._configService = configService;
        this._registry = registry;
        this._defaultModels = defaultModels;
        this._requestTimeouts = requestTimeouts;
        this._providerRequestTimeoutMs = providerRequestTimeoutMs;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public async resolve(capability: IntelligenceCapability, reference?: IIntelligenceModelReference, timeoutMs?: number): Promise<IResolvedIntelligenceModel> {
        const resolved = this.resolveRequest(capability, reference, timeoutMs);
        const handle = await resolved.adapter.load(resolved.request);

        return {
            handle,
            provider: resolved.request.configuration.provider,
            model: resolved.request.configuration.model,
            timeoutMs: resolved.request.operationTimeoutMs,
        };
    }

    public resolveRequest(
        capability: IntelligenceCapability,
        reference?: IIntelligenceModelReference,
        timeoutMs?: number,
    ): IResolvedIntelligenceProviderRequest {
        const configuredDefault = this._defaultModels[capability];
        const provider = reference?.provider ?? configuredDefault?.provider;
        const model = reference?.model ?? configuredDefault?.model;
        const configuration = resolveIntelligenceProviderConfiguration(this._configService, {
            provider,
            model,
        });
        const adapter = this._registry.resolve(configuration.provider, capability);
        const operationTimeoutMs = this.resolveTimeout(capability, timeoutMs);

        return {
            adapter,
            request: {
                capability,
                configuration,
                operationTimeoutMs,
                providerRequestTimeoutMs: Math.min(this._providerRequestTimeoutMs, operationTimeoutMs),
            },
        };
    }

    public getDefaultConfiguration(capability = IntelligenceCapabilityNames.Language): IIntelligenceProviderConfiguration {
        const configuredDefault = this._defaultModels[capability];

        return resolveIntelligenceProviderConfiguration(this._configService, configuredDefault);
    }

    private resolveTimeout(capability: IntelligenceCapability, timeoutMs: number | undefined): number {
        const resolved = timeoutMs ?? this._requestTimeouts[capability];
        if (!Number.isSafeInteger(resolved) || resolved < 1) {
            throw new IntelligenceConfigurationError(`Timeout for ${capability} must be a positive safe integer.`);
        }

        return resolved;
    }

    // #endregion
}
