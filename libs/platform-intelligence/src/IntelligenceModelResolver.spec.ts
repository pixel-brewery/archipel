// #region Imports

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { describe, expect, it } from 'vitest';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceConfigurationError } from './errors/IntelligenceConfigurationError.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';
import { IntelligenceProviderAdapterBase } from './providers/abstracts/IntelligenceProviderAdapterBase.js';
import type { IIntelligenceProviderLoadRequest } from './providers/IIntelligenceProviderLoadRequest.js';

// #endregion

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

    public override async load(_request: IIntelligenceProviderLoadRequest): Promise<unknown> {
        return {};
    }

    // #endregion
}

describe('IntelligenceModelResolver', () => {
    // #region Methods

    it('should preserve a long total operation budget while bounding outbound provider requests', () => {
        // arrange
        const adapter = new TestIntelligenceProviderAdapter();
        const resolver = createResolver(adapter);

        // act
        const result = resolver.resolveRequest(IntelligenceCapabilityNames.Language, undefined, 120_000);

        // assert
        expect(result.request).toMatchObject({
            operationTimeoutMs: 120_000,
            providerRequestTimeoutMs: 5_000,
        });
    });

    it('should cap the provider request budget at a shorter total operation budget', () => {
        // arrange
        const adapter = new TestIntelligenceProviderAdapter();
        const resolver = createResolver(adapter);

        // act
        const result = resolver.resolveRequest(IntelligenceCapabilityNames.Language, undefined, 3_000);

        // assert
        expect(result.request).toMatchObject({
            operationTimeoutMs: 3_000,
            providerRequestTimeoutMs: 3_000,
        });
    });

    it('should reject an implicit provider-specific model default', () => {
        // arrange
        const adapter = new TestIntelligenceProviderAdapter();
        const resolver = createResolver(adapter, {});

        // act
        const action = (): unknown => resolver.resolveRequest(IntelligenceCapabilityNames.Language);

        // assert
        expect(action).toThrow(new IntelligenceConfigurationError('An intelligence model must be configured explicitly.'));
    });

    // #endregion
});

function createResolver(
    adapter: TestIntelligenceProviderAdapter,
    defaultModels = {
        [IntelligenceCapabilityNames.Language]: {
            provider: 'test',
            model: 'test-model',
        },
    },
): IntelligenceModelResolver {
    const configService = {
        tryGet: <TValue>(_key: string, fallback: TValue): TValue => fallback,
    } as unknown as ConfigService;
    const registry = {
        resolve: (): TestIntelligenceProviderAdapter => adapter,
    } as never;

    return new IntelligenceModelResolver(
        configService,
        registry,
        defaultModels,
        {
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
        },
        5_000,
    );
}
