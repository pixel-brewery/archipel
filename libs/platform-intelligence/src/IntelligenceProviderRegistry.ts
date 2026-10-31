// #region Imports

import { Inject, Injectable } from '@nestjs/common';
import type { IntelligenceCapability } from './contracts/IntelligenceCapability.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import { INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN } from './tokens/IntelligenceProviderAdaptersToken.js';

// #endregion

/**
 * Immutable registry of provider adapters and their supported capabilities.
 *
 * @public
 */
@Injectable()
export class IntelligenceProviderRegistry {
    // #region Fields

    private static readonly _MAX_PROVIDERS = 32;
    private readonly _adapters: ReadonlyMap<string, IntelligenceProviderAdapterBase>;

    // #endregion

    // #region Ctor

    public constructor(@Inject(INTELLIGENCE_PROVIDER_ADAPTERS_TOKEN) adapters: ReadonlyArray<IntelligenceProviderAdapterBase>) {
        if (adapters.length > IntelligenceProviderRegistry._MAX_PROVIDERS) {
            throw new IntelligenceConfigurationError(`At most ${IntelligenceProviderRegistry._MAX_PROVIDERS} intelligence providers can be registered.`);
        }

        const adapterMap = new Map<string, IntelligenceProviderAdapterBase>();
        for (const adapter of adapters) {
            const provider = adapter.provider.trim().toLowerCase();
            if (provider.length === 0) {
                throw new IntelligenceConfigurationError('Intelligence provider names must not be empty.');
            }
            if (adapterMap.has(provider)) {
                throw new IntelligenceConfigurationError(`Duplicate intelligence provider adapter: ${provider}.`);
            }
            if (adapter.capabilities.length === 0 || new Set(adapter.capabilities).size !== adapter.capabilities.length) {
                throw new IntelligenceConfigurationError(`Intelligence provider ${provider} must declare a non-empty, duplicate-free capability list.`);
            }

            adapterMap.set(provider, adapter);
        }

        this._adapters = adapterMap;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /**
     * Returns all registered provider identifiers.
     *
     * @public
     */
    public listProviders(): ReadonlyArray<string> {
        return Array.from(this._adapters.keys());
    }

    /**
     * Returns providers supporting one capability.
     *
     * @public
     */
    public listProvidersFor(capability: IntelligenceCapability): ReadonlyArray<string> {
        return Array.from(this._adapters.values())
            .filter((adapter) => adapter.capabilities.includes(capability))
            .map((adapter) => adapter.provider);
    }

    /**
     * Resolves an adapter and verifies capability support.
     *
     * @internal
     */
    public resolve(provider: string, capability: IntelligenceCapability): IntelligenceProviderAdapterBase {
        const normalizedProvider = provider.trim().toLowerCase();
        const adapter = this._adapters.get(normalizedProvider);
        if (!adapter) {
            throw new IntelligenceConfigurationError(`No intelligence provider adapter is registered for ${normalizedProvider}.`);
        }
        if (!adapter.capabilities.includes(capability)) {
            throw new IntelligenceConfigurationError(`Intelligence provider ${normalizedProvider} does not support the ${capability} capability.`);
        }

        return adapter;
    }

    // #endregion
}
