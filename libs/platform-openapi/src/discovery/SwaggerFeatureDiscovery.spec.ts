import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type { ContentTemplateEngine, HostService } from '@pixel-brewery/archipel-platform-core';
import type { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import type { INestApplication } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwaggerFeatureRegistry } from '../registry/SwaggerFeatureRegistry.js';
import { SwaggerMultiDocumentService } from '../services/SwaggerMultiDocumentService.js';
import { SwaggerFeatureDiscovery } from './SwaggerFeatureDiscovery.js';

vi.mock('../decorators/SwaggerFeature', () => ({
    getRegisteredSwaggerFeatures: vi.fn().mockReturnValue([
        {
            name: 'users',
            title: 'Users API',
            description: 'User endpoints',
            tag: 'users',
            tags: ['users', 'admin'],
            extraModels: [String],
            strictModels: [Boolean],
            path: 'docs/users',
        },
        {
            name: 'orders',
            title: 'Orders API',
            description: 'Order endpoints',
            tag: 'orders',
            tags: undefined,
            extraModels: [String, Number],
            strictModels: [Boolean, BigInt],
            path: undefined,
        },
    ]),
}));

describe('SwaggerFeatureDiscovery', () => {
    // #region Fields

    let discovery: SwaggerFeatureDiscovery;
    let registry: SwaggerFeatureRegistry;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        discovery = new SwaggerFeatureDiscovery();
        registry = new SwaggerFeatureRegistry();
    });

    it('should register all discovered features with correct metadata', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);

        // assert
        const features = registry.getFeatures();
        expect(features).toHaveLength(2);
    });

    it('should preserve explicit tags when provided', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);

        // assert
        const usersFeature = registry.getFeatures().find((f) => f.name === 'users');
        expect(usersFeature?.tags).toEqual(['users', 'admin']);
    });

    it('should fall back to tag array when tags are not provided', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);

        // assert
        const ordersFeature = registry.getFeatures().find((f) => f.name === 'orders');
        expect(ordersFeature?.tags).toEqual(['orders']);
    });

    it('should generate default path when not provided', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);

        // assert
        const ordersFeature = registry.getFeatures().find((f) => f.name === 'orders');
        expect(ordersFeature?.path).toBe('docs/orders');
    });

    it('should preserve discovered endpointless contract models', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);

        // assert
        const usersFeature = registry.getFeatures().find((feature) => feature.name === 'users');
        expect(usersFeature?.extraModels).toEqual([String]);
        expect(usersFeature?.strictModels).toEqual([Boolean]);
    });

    it('should register default all-features document', () => {
        // act
        discovery.registerDefaultFeatures(registry);

        // assert
        const features = registry.getFeatures();
        expect(features).toHaveLength(1);
        expect(features[0].name).toBe('all');
        expect(features[0].tag).toBe('*');
    });

    it('should deduplicate all discovered contract models for the all-features document', () => {
        // act
        discovery.registerDiscoveredFeatures(registry);
        discovery.registerDefaultFeatures(registry);

        // assert
        const allFeature = registry.getFeatures().find((feature) => feature.name === 'all');
        expect(allFeature?.extraModels).toEqual([String, Number]);
        expect(allFeature?.strictModels).toEqual([Boolean, BigInt]);
    });

    it('should generate documents without registering HTTP routes', () => {
        const expected: ReturnType<SwaggerMultiDocumentService['generateOpenApiDocuments']> = [];
        const generate = vi.spyOn(SwaggerMultiDocumentService.prototype, 'generateOpenApiDocuments').mockReturnValue(expected);

        const result = SwaggerFeatureDiscovery.generateMultiDocumentOpenApi(
            {} as INestApplication,
            {} as ConfigService,
            {} as HostService,
            {} as ResourceManager,
            {} as ContentTemplateEngine,
        );

        expect(result).toBe(expected);
        expect(generate).toHaveBeenCalledOnce();
    });

    // #endregion
});
