import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IFeatureSwaggerConfig } from './IFeatureSwaggerConfig.js';
import { SwaggerFeatureRegistry } from './SwaggerFeatureRegistry.js';

describe('SwaggerFeatureRegistry', () => {
    // #region Fields

    let registry: SwaggerFeatureRegistry;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        registry = new SwaggerFeatureRegistry();
    });

    it('should register a feature', () => {
        // arrange
        const feature: IFeatureSwaggerConfig = {
            name: 'users',
            title: 'Users API',
            description: 'User management endpoints',
            tag: 'users',
            tags: ['users'],
            path: 'docs/users',
        };

        // act
        registry.registerFeature(feature);

        // assert
        expect(registry.getFeatures()).toHaveLength(1);
        expect(registry.getFeatures()[0]).toEqual(feature);
    });

    it('should return features sorted by name', () => {
        // arrange
        registry.registerFeature({ name: 'zebra', title: 'Z', description: '', tag: 'z', tags: ['z'], path: 'docs/z' });
        registry.registerFeature({ name: 'alpha', title: 'A', description: '', tag: 'a', tags: ['a'], path: 'docs/a' });

        // act
        const features = registry.getFeatures();

        // assert
        expect(features[0].name).toBe('alpha');
        expect(features[1].name).toBe('zebra');
    });

    it('should prevent duplicate feature registration', () => {
        // arrange
        const feature: IFeatureSwaggerConfig = {
            name: 'users',
            title: 'Users API',
            description: '',
            tag: 'users',
            tags: ['users'],
            path: 'docs/users',
        };

        // act
        registry.registerFeature(feature);
        registry.registerFeature(feature);

        // assert
        expect(registry.getFeatures()).toHaveLength(1);
    });

    it('should prevent registration after finalization', () => {
        // arrange
        registry.finalize();

        // act
        registry.registerFeature({
            name: 'late',
            title: 'Late Feature',
            description: '',
            tag: 'late',
            tags: ['late'],
            path: 'docs/late',
        });

        // assert
        expect(registry.getFeatures()).toHaveLength(0);
    });

    it('should be idempotent when finalized multiple times', () => {
        // act
        registry.finalize();
        registry.finalize();

        // assert - no error thrown
        expect(registry.getFeatures()).toHaveLength(0);
    });

    it('should return a copy of features to prevent mutation', () => {
        // arrange
        registry.registerFeature({
            name: 'test',
            title: 'Test',
            description: '',
            tag: 'test',
            tags: ['test'],
            path: 'docs/test',
        });

        // act
        const features = registry.getFeatures();
        features.push({ name: 'hacked', title: '', description: '', tag: '', tags: [], path: '' });

        // assert
        expect(registry.getFeatures()).toHaveLength(1);
    });

    // #endregion
});
