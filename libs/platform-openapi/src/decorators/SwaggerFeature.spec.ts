// #region Imports

import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// #endregion

// #region Tests

describe('SwaggerFeature', () => {
    beforeEach(() => {
        // Clear global store before each test — the array is non-configurable,
        // so we splice its contents instead of redefining the property.
        const key = '__ARCHIPEL_SWAGGER_FEATURES__';
        const store = (globalThis as Record<string, unknown>)[key] as Array<unknown> | undefined;
        if (store) {
            store.splice(0, store.length);
        }
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetModules();
    });

    it('should export SWAGGER_FEATURE_METADATA_KEY constant', async () => {
        // arrange / act
        const { SWAGGER_FEATURE_METADATA_KEY } = await import('./SwaggerFeature.js');

        // assert
        expect(SWAGGER_FEATURE_METADATA_KEY).toBe('swagger:feature');
    });

    it('should store metadata on the target class', async () => {
        // arrange
        const { SwaggerFeature, getSwaggerFeatureMetadata } = await import('./SwaggerFeature.js');
        const metadata = {
            name: 'test',
            title: 'Test API',
            description: 'Test description',
            tag: 'Test',
            tags: ['Test'],
        };

        class TestModule {}
        SwaggerFeature(metadata)(TestModule);

        // act
        const result = getSwaggerFeatureMetadata(TestModule);

        // assert
        expect(result).toMatchObject({
            name: 'test',
            title: 'Test API',
            tag: 'Test',
        });
    });

    it('should auto-generate path from name if not provided', async () => {
        // arrange
        const { SwaggerFeature, getSwaggerFeatureMetadata } = await import('./SwaggerFeature.js');

        class UserModule {}
        SwaggerFeature({
            name: 'users',
            title: 'Users',
            description: 'User endpoints',
            tag: 'User',
            tags: ['User'],
        })(UserModule);

        // act
        const result = getSwaggerFeatureMetadata(UserModule);

        // assert
        expect(result).toMatchObject({ path: 'docs/users' });
    });

    it('should preserve explicit path', async () => {
        // arrange
        const { SwaggerFeature, getSwaggerFeatureMetadata } = await import('./SwaggerFeature.js');

        class CustomModule {}
        SwaggerFeature({
            name: 'custom',
            title: 'Custom',
            description: 'Custom endpoints',
            tag: 'Custom',
            tags: ['Custom'],
            path: 'api-docs/custom',
        })(CustomModule);

        // act
        const result = getSwaggerFeatureMetadata(CustomModule);

        // assert
        expect(result).toMatchObject({ path: 'api-docs/custom' });
    });

    it('should preserve endpointless contract models', async () => {
        // arrange
        const { SwaggerFeature, getSwaggerFeatureMetadata } = await import('./SwaggerFeature.js');

        class ContractModel {}
        class ContractModule {}
        SwaggerFeature({
            name: 'contracts',
            title: 'Contracts',
            description: 'Endpointless contracts',
            tag: 'Contracts',
            tags: ['Contracts'],
            extraModels: [ContractModel],
        })(ContractModule);

        // act
        const result = getSwaggerFeatureMetadata(ContractModule);

        // assert
        expect(result?.extraModels).toEqual([ContractModel]);
    });

    it('should preserve strict contract roots', async () => {
        // arrange
        const { SwaggerFeature, getSwaggerFeatureMetadata } = await import('./SwaggerFeature.js');

        class ContractModel {}
        class ContractModule {}
        SwaggerFeature({
            name: 'strict-contracts',
            title: 'Strict contracts',
            description: 'Closed endpointless contracts',
            tag: 'Contracts',
            tags: ['Contracts'],
            strictModels: [ContractModel],
        })(ContractModule);

        // act
        const result = getSwaggerFeatureMetadata(ContractModule);

        // assert
        expect(result?.strictModels).toEqual([ContractModel]);
    });

    it('should register features in the global store', async () => {
        // arrange
        const { SwaggerFeature, getRegisteredSwaggerFeatures } = await import('./SwaggerFeature.js');

        class AlphaModule {}
        SwaggerFeature({
            name: 'alpha',
            title: 'Alpha',
            description: 'Alpha desc',
            tag: 'Alpha',
            tags: ['Alpha'],
        })(AlphaModule);

        // act
        void AlphaModule;
        const features = getRegisteredSwaggerFeatures();

        // assert
        expect(features.length).toBeGreaterThanOrEqual(1);
        expect(features.some((f) => f.name === 'alpha')).toBe(true);
    });

    it('should return features sorted by name', async () => {
        // arrange
        const { SwaggerFeature, getRegisteredSwaggerFeatures } = await import('./SwaggerFeature.js');

        class ZebraModule {}
        SwaggerFeature({ name: 'zebra', title: 'Z', description: '', tag: 'Z', tags: [] })(ZebraModule);

        class AppleModule {}
        SwaggerFeature({ name: 'apple', title: 'A', description: '', tag: 'A', tags: [] })(AppleModule);

        void ZebraModule;
        void AppleModule;

        // act
        const features = getRegisteredSwaggerFeatures();

        // assert
        const names = features.map((f) => f.name);
        const appleIdx = names.indexOf('apple');
        const zebraIdx = names.indexOf('zebra');
        expect(appleIdx).toBeLessThan(zebraIdx);
    });

    it('should skip duplicate feature names', async () => {
        // arrange
        const { SwaggerFeature, getRegisteredSwaggerFeatures } = await import('./SwaggerFeature.js');

        class DupModule1 {}
        SwaggerFeature({ name: 'dup', title: 'Dup 1', description: '', tag: 'D', tags: [] })(DupModule1);

        class DupModule2 {}
        SwaggerFeature({ name: 'dup', title: 'Dup 2', description: '', tag: 'D', tags: [] })(DupModule2);

        void DupModule1;
        void DupModule2;

        // act
        const features = getRegisteredSwaggerFeatures();
        const dupFeatures = features.filter((f) => f.name === 'dup');

        // assert
        expect(dupFeatures).toHaveLength(1);
        expect(dupFeatures[0].title).toBe('Dup 1');
    });
});

// #endregion
