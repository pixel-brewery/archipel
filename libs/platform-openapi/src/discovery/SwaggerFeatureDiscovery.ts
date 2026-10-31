// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ContentTemplateEngine, HostService } from '@pixel-brewery/archipel-platform-core';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { INestApplication } from '@nestjs/common';
import { getRegisteredSwaggerFeatures } from '../decorators/SwaggerFeature.js';
import { type ISwaggerThemeConfig } from '../ISwaggerThemeConfig.js';
import { SwaggerFeatureRegistry } from '../registry/SwaggerFeatureRegistry.js';
import { type IOpenApiFeatureDocument } from '../services/IOpenApiFeatureDocument.js';
import { SwaggerMultiDocumentService } from '../services/SwaggerMultiDocumentService.js';

// #endregion

/**
 * Centralizes the discovery of Swagger features declared across backend modules.
 *
 * @public
 */
export class SwaggerFeatureDiscovery {
    // #region Methods

    /**
     * Registers all discovered feature modules in the provided Swagger registry.
     *
     * @public
     * @param featureRegistry - The registry that collects Swagger feature information.
     * @return The discovery instance for chaining.
     */
    public registerDiscoveredFeatures(featureRegistry: SwaggerFeatureRegistry): this {
        for (const metadata of getRegisteredSwaggerFeatures()) {
            featureRegistry.registerFeature({
                name: metadata.name,
                title: metadata.title,
                description: metadata.description,
                tag: metadata.tag,
                tags: metadata.tags ?? [metadata.tag],
                extraModels: metadata.extraModels,
                strictModels: metadata.strictModels,
                path: metadata.path ?? `docs/${metadata.name}`,
            });
        }

        return this;
    }

    /**
     * Registers the default composite Swagger documents that aggregate the complete API.
     *
     * @public
     * @param featureRegistry - The registry that collects Swagger feature information.
     * @return The discovery instance for chaining.
     */
    public registerDefaultFeatures(featureRegistry: SwaggerFeatureRegistry): this {
        const extraModels = Array.from(new Set(featureRegistry.getFeatures().flatMap((feature) => feature.extraModels ?? [])));
        const strictModels = Array.from(new Set(featureRegistry.getFeatures().flatMap((feature) => feature.strictModels ?? [])));

        featureRegistry.registerFeature({
            name: 'all',
            title: 'All Features',
            description: 'Complete API documentation for all features',
            tag: '*',
            tags: ['*'],
            ...(extraModels.length > 0 ? { extraModels } : {}),
            ...(strictModels.length > 0 ? { strictModels } : {}),
            path: 'docs/all',
        });

        return this;
    }

    /**
     * Auto-discovers and sets up multi-document Swagger in a single call.
     * Handles feature discovery, registry setup, and service initialization.
     *
     * @public
     * @param app - The NestJS application instance
     * @param config - Configuration service for reading app settings
     * @param host - Host service for determining base URL
     * @param resource - Resource manager for loading theme assets
     * @param content - Content template engine for rendering HTML
     * @param themeConfig - Optional theme configuration for branding colors
     * @return Promise resolving when setup is complete
     *
     * @example
     * ```typescript
     * await SwaggerFeatureDiscovery.setupMultiDocumentSwagger(
     *   app,
     *   config,
     *   host,
     *   resource,
     *   content,
     *   { primary: '#0066cc', secondary: '#003d99' }
     * );
     * ```
     */
    public static async setupMultiDocumentSwagger(
        app: INestApplication,
        config: ConfigService,
        host: HostService,
        resource: ResourceManager,
        content: ContentTemplateEngine,
        themeConfig?: ISwaggerThemeConfig,
    ): Promise<void> {
        const swaggerService = this.createMultiDocumentService(app, config, host, resource, content, themeConfig);
        await swaggerService.setupMultipleSwaggerDocuments();
    }

    /**
     * Generates every discovered OpenAPI feature document without registering routes,
     * initializing the Nest application, or starting an HTTP listener.
     *
     * @public
     * @param app - Constructed, but not necessarily initialized, NestJS application.
     * @param config - Configuration service for document metadata.
     * @param host - Host service for server metadata.
     * @param resource - Resource manager used by the shared Swagger service.
     * @param content - Template engine used by the shared Swagger service.
     * @param themeConfig - Optional theme configuration.
     * @returns Generated feature documents and their feature metadata.
     */
    public static generateMultiDocumentOpenApi(
        app: INestApplication,
        config: ConfigService,
        host: HostService,
        resource: ResourceManager,
        content: ContentTemplateEngine,
        themeConfig?: ISwaggerThemeConfig,
    ): IOpenApiFeatureDocument[] {
        return this.createMultiDocumentService(app, config, host, resource, content, themeConfig).generateOpenApiDocuments();
    }

    private static createMultiDocumentService(
        app: INestApplication,
        config: ConfigService,
        host: HostService,
        resource: ResourceManager,
        content: ContentTemplateEngine,
        themeConfig?: ISwaggerThemeConfig,
    ): SwaggerMultiDocumentService {
        const registry = new SwaggerFeatureRegistry();
        const discovery = new SwaggerFeatureDiscovery();

        // Auto-discover and register features from modules with @SwaggerFeature decorator
        discovery.registerDiscoveredFeatures(registry);

        // Register default aggregate documents
        discovery.registerDefaultFeatures(registry);

        return new SwaggerMultiDocumentService(app, config, host, registry, resource, content, themeConfig);
    }

    // #endregion
}
