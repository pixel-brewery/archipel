// #region Imports

import { describe, expect, it } from 'vitest';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceProviderRegistry } from './IntelligenceProviderRegistry.js';
import { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from './providers/IIntelligenceProviderLoadRequest.js';

// #endregion

class TestProviderAdapter extends IntelligenceProviderAdapterBase {
    // #region Fields

    // #endregion

    // #region Ctor

    public constructor(provider: string, capabilities: IntelligenceProviderAdapterBase['capabilities']) {
        super();

        this.provider = provider;
        this.capabilities = capabilities;
    }

    // #endregion

    // #region Properties

    public readonly provider: string;
    public readonly capabilities: IntelligenceProviderAdapterBase['capabilities'];

    // #endregion

    // #region Methods

    public override async load(_request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        return {};
    }

    // #endregion
}

describe('IntelligenceProviderRegistry', () => {
    // #region Methods

    it('should resolve custom providers by capability', () => {
        // arrange
        const language = new TestProviderAdapter('custom', [IntelligenceCapabilityNames.Language]);
        const media = new TestProviderAdapter('media', [IntelligenceCapabilityNames.Image, IntelligenceCapabilityNames.Video]);
        const registry = new IntelligenceProviderRegistry([language, media]);

        // act
        const resolved = registry.resolve('CUSTOM', IntelligenceCapabilityNames.Language);

        // assert
        expect(resolved).toBe(language);
    });

    it('should list registered providers by capability', () => {
        // arrange
        const language = new TestProviderAdapter('custom', [IntelligenceCapabilityNames.Language]);
        const media = new TestProviderAdapter('media', [IntelligenceCapabilityNames.Image, IntelligenceCapabilityNames.Video]);
        const registry = new IntelligenceProviderRegistry([language, media]);

        // act
        const providers = registry.listProvidersFor(IntelligenceCapabilityNames.Video);

        // assert
        expect(providers).toEqual(['media']);
    });

    it('should reject providers that do not support the requested capability', () => {
        // arrange
        const adapter = new TestProviderAdapter('custom', [IntelligenceCapabilityNames.Language]);
        const registry = new IntelligenceProviderRegistry([adapter]);

        // act
        const action = (): IntelligenceProviderAdapterBase => registry.resolve('custom', IntelligenceCapabilityNames.Image);

        // assert
        expect(action).toThrow('does not support the image capability');
    });

    it('should reject duplicate provider registrations', () => {
        // arrange
        const adapter = new TestProviderAdapter('custom', [IntelligenceCapabilityNames.Language]);

        // act
        const action = (): IntelligenceProviderRegistry => new IntelligenceProviderRegistry([adapter, adapter]);

        // assert
        expect(action).toThrow(new IntelligenceConfigurationError('Duplicate intelligence provider adapter: custom.'));
    });

    // #endregion
});
