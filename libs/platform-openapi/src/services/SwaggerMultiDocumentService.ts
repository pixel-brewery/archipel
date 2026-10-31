// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { APP_NAME, ContentTemplateEngine, HostService } from '@pixel-brewery/archipel-platform-core';
import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { INestApplication, Logger, type Type } from '@nestjs/common';
import { DocumentBuilder, getSchemaPath, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { applyStrictOpenApiModelContracts } from '../contracts/applyStrictOpenApiModelContracts.js';
import { APP_VERSION, SWAGGER_CONTACT_EMAIL, SWAGGER_CONTACT_NAME, SWAGGER_CONTACT_URL } from '../env.js';
import { type ISwaggerThemeConfig } from '../ISwaggerThemeConfig.js';
import { IFeatureSwaggerConfig } from '../registry/IFeatureSwaggerConfig.js';
import { SwaggerFeatureRegistry } from '../registry/SwaggerFeatureRegistry.js';
import { SwaggerTheme } from '../SwaggerTheme.js';
import { IOpenApiFeatureDocument } from './IOpenApiFeatureDocument.js';

// #endregion

export class SwaggerMultiDocumentService {
    // #region Fields

    private readonly _logger = new Logger(SwaggerMultiDocumentService.name);
    private readonly _theme: SwaggerTheme;
    private readonly _app: INestApplication;
    private readonly _configService: ConfigService;
    private readonly _hostService: HostService;
    private readonly _featureRegistry: SwaggerFeatureRegistry;
    private readonly _resourceManager: ResourceManager;
    private readonly _contentTemplateEngine: ContentTemplateEngine;

    // #endregion

    // #region Ctor

    public constructor(
        app: INestApplication,
        configService: ConfigService,
        hostService: HostService,
        featureRegistry: SwaggerFeatureRegistry,
        resourceManager: ResourceManager,
        contentTemplateEngine: ContentTemplateEngine,
        themeConfig?: ISwaggerThemeConfig,
    ) {
        this._app = app;
        this._configService = configService;
        this._hostService = hostService;
        this._featureRegistry = featureRegistry;
        this._resourceManager = resourceManager;
        this._contentTemplateEngine = contentTemplateEngine;
        this._theme = new SwaggerTheme(resourceManager, themeConfig);
    }

    // #endregion

    // #region Methods

    /**
     * Setup multiple Swagger documents for different features
     */
    public async setupMultipleSwaggerDocuments(): Promise<void> {
        // Ensure features are finalized
        this._featureRegistry.finalize();

        // Get dynamically discovered features
        const features = this._featureRegistry.getFeatures();

        if (features.length === 0) {
            this._logger.warn('No Swagger features found. Only main documentation will be available.');
            return;
        }

        await this.setupMainDocumentationIndex(features);

        features.forEach((feature) => {
            this.setupFeatureDocument(feature);
        });

        this._logger.log(`Setup ${features.length} Swagger documents`, SwaggerMultiDocumentService.name);
    }

    /**
     * Generates OpenAPI documents for every registered feature without wiring HTTP routes.
     */
    public generateOpenApiDocuments(): IOpenApiFeatureDocument[] {
        this._featureRegistry.finalize();

        const features = this._featureRegistry.getFeatures();

        if (features.length === 0) {
            this._logger.warn('No Swagger features found. Skipping OpenAPI document generation.');
            return new Array<IOpenApiFeatureDocument>();
        }

        return features.map((feature) => ({
            feature,
            document: this.createDocumentForFeature(feature),
        }));
    }

    /**
     * Create main documentation index page
     */
    private async setupMainDocumentationIndex(features: IFeatureSwaggerConfig[]): Promise<void> {
        const baseUrl = this._hostService.host;
        const indexHtml = await this.generateIndexHtml(features, baseUrl);

        this._app.getHttpAdapter().get('/docs', (_req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.send(indexHtml);
        });

        this._logger.log(`Main documentation index available at: ${baseUrl}/docs`, SwaggerMultiDocumentService.name);
    }

    /**
     * Setup individual feature document
     */
    private setupFeatureDocument(feature: IFeatureSwaggerConfig): void {
        const document = this.createDocumentForFeature(feature);
        const jsonDocumentPath = this.getJsonDocumentPath(feature);

        SwaggerModule.setup(feature.path, this._app, document, {
            ...this._theme.getOptions(),
            customJs: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.19.0/swagger-ui-bundle.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.19.0/swagger-ui-standalone-preset.min.js',
            ],
            customCssUrl: [
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.19.0/swagger-ui.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.19.0/swagger-ui-standalone-preset.min.css',
                'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.19.0/swagger-ui.css',
            ],

            explorer: false,
            jsonDocumentUrl: jsonDocumentPath ?? '.json',
        });

        // Create JSON endpoint for each feature
        this._app.getHttpAdapter().get(jsonDocumentPath, (_req, res) => {
            res.json(document);
        });

        const baseUrl = this._hostService.host;
        this._logger.log(`${feature.title} documentation available at: ${baseUrl}/${feature.path}`, SwaggerMultiDocumentService.name);
    }

    private createDocumentForFeature(feature: IFeatureSwaggerConfig): OpenAPIObject {
        const casingNotice =
            '\n\n> **Note:** A global `CasingInterceptor` normalizes all request body keys to `camelCase`. All response properties are returned in `camelCase` as well.';

        const docBuilder = new DocumentBuilder()
            .addServer(this._hostService.host, `${this._hostService.stage} server`)
            .setTitle(feature.title)
            .setDescription(`${feature.description}${casingNotice}`)
            .setVersion(this._configService.get(APP_VERSION.key))
            .setContact(
                this._configService.get(SWAGGER_CONTACT_NAME.key),
                this._configService.get(SWAGGER_CONTACT_URL.key),
                this._configService.get(SWAGGER_CONTACT_EMAIL.key),
            )
            .addBearerAuth({
                name: 'Authorization',
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            });

        const contractModels = Array.from(new Set([...(feature.extraModels ?? []), ...(feature.strictModels ?? [])]));
        const document = SwaggerModule.createDocument(this._app, docBuilder.build(), {
            ...(contractModels.length ? { extraModels: contractModels } : {}),
        });
        applyStrictOpenApiModelContracts(document, feature.strictModels ?? []);

        if (feature.tag !== '*') {
            const documentCopy = JSON.parse(JSON.stringify(document)) as OpenAPIObject;
            const featureTags = feature.tags?.length ? feature.tags : [feature.tag];
            const preservedSchemaRefs = contractModels.map((model) => this.getSchemaName(model));
            this.filterDocumentByTags(documentCopy, featureTags, preservedSchemaRefs);

            return documentCopy;
        }

        return document;
    }

    /**
     * Generate HTML index page using swagger.html template
     */
    private async generateIndexHtml(features: IFeatureSwaggerConfig[], baseUrl: string): Promise<string> {
        const appName = this._configService.get<string>(APP_NAME.key);
        const themeConfig = this._theme.getConfig();
        const templateData = {
            title: `${appName} API Documentation`,
            style: {
                primary: themeConfig.primary,
                secondary: themeConfig.secondary,
            },
            header: {
                title: `${appName} API Documentation`,
                description: 'Explore our comprehensive API documentation organized by feature',
            },
            features: features.map((feature) => ({
                tag: feature.tag,
                title: feature.title,
                description: feature.description,
                path: feature.path,
                jsonPath: this.getJsonDocumentPath(feature),
            })),
            footer: {
                version: this._configService.get(APP_VERSION.key),
                stage: this._hostService.stage,
                copyright: `${new Date().getFullYear()} ${appName}. All rights reserved.`,
                baseUrl: baseUrl,
            },
        };

        const template = await this._resourceManager.loadAsStringAsync('swagger.html');
        const compiledTemplate = this._contentTemplateEngine.compileTemplate(template, templateData as Record<string, unknown>);

        return compiledTemplate;
    }

    private getJsonDocumentPath(feature: IFeatureSwaggerConfig): string {
        return `/${feature.path.replace('docs', 'api')}.json`;
    }

    /**
     * Filter Swagger document to only include operations with the specified tags and their referenced schemas.
     * Supports multi-tag filtering for operations.
     */
    private filterDocumentByTags(document: OpenAPIObject, tags: Array<string>, preservedSchemaRefs: ReadonlyArray<string>): void {
        const allowedTags = new Set(tags);
        const filteredPaths: Record<string, Record<string, unknown>> = {};
        const usedSchemaRefs = new Set<string>(preservedSchemaRefs);

        for (const [path, pathItem] of Object.entries(document.paths ?? {})) {
            const filteredPathItem: Record<string, unknown> = {};

            for (const [method, operation] of Object.entries(pathItem as Record<string, unknown>)) {
                if (operation && typeof operation === 'object' && 'tags' in operation) {
                    const operationTags = (operation as { tags?: Array<string> }).tags ?? [];
                    if (Array.isArray(operationTags) && operationTags.some((tag) => allowedTags.has(tag))) {
                        filteredPathItem[method] = operation;
                        this.collectSchemaReferences(operation, usedSchemaRefs);
                    }
                }
            }

            if (Object.keys(filteredPathItem).length > 0) {
                filteredPaths[path] = filteredPathItem;
            }
        }

        document.paths = filteredPaths;

        if (document.components?.schemas) {
            this.filterSchemas(document.components.schemas as Record<string, unknown>, usedSchemaRefs);
        }

        if (document.tags) {
            document.tags = document.tags.filter((docTag: { name?: string }) => docTag.name && allowedTags.has(docTag.name));
        }
    }

    /**
     * Resolves the effective OpenAPI schema name, including names customized
     * through NestJS Swagger's `@ApiSchema` decorator.
     */
    private getSchemaName(model: Type<unknown>): string {
        const schemaPath = getSchemaPath(model);
        const schemaPathPrefix = '#/components/schemas/';

        return schemaPath.startsWith(schemaPathPrefix) ? schemaPath.slice(schemaPathPrefix.length) : schemaPath;
    }

    /**
     * Collect all `$ref` schema references from an object graph with cycle protection.
     */
    private collectSchemaReferences(obj: unknown, usedRefs: Set<string>, visited?: WeakSet<object>, depth = 0): void {
        if (!obj || typeof obj !== 'object' || depth > 50) {
            return;
        }

        const seen = visited ?? new WeakSet<object>();

        if (seen.has(obj as object)) {
            return;
        }
        seen.add(obj as object);

        if (Array.isArray(obj)) {
            for (const item of obj) {
                this.collectSchemaReferences(item, usedRefs, seen, depth + 1);
            }
            return;
        }

        const record = obj as Record<string, unknown>;

        if (typeof record['$ref'] === 'string') {
            const refMatch = record['$ref'].match(/#\/components\/schemas\/(.+)$/);
            if (refMatch) {
                usedRefs.add(refMatch[1]);
            }
        }

        for (const value of Object.values(record)) {
            this.collectSchemaReferences(value, usedRefs, seen, depth + 1);
        }
    }

    /**
     * Filter schemas to only include used ones and collect nested references.
     */
    private filterSchemas(schemas: Record<string, unknown>, usedRefs: Set<string>): void {
        const originalSchemas = { ...schemas };

        const toProcess = Array.from(usedRefs);
        const processed = new Set<string>();

        while (toProcess.length > 0) {
            const currentSchema = toProcess.pop();
            if (!currentSchema || processed.has(currentSchema)) {
                continue;
            }

            processed.add(currentSchema);
            const schema = originalSchemas[currentSchema];

            if (schema) {
                this.collectSchemaReferences(schema, usedRefs);

                for (const ref of usedRefs) {
                    if (!processed.has(ref) && !toProcess.includes(ref)) {
                        toProcess.push(ref);
                    }
                }
            }
        }

        const removedSchemas: Array<string> = [];
        for (const schemaName of Object.keys(schemas)) {
            if (!usedRefs.has(schemaName)) {
                delete schemas[schemaName];
                removedSchemas.push(schemaName);
            }
        }

        // if (removedSchemas.length > 0) {
        //   this._logger.debug(`Removed ${removedSchemas.length} unreferenced schemas: ${removedSchemas.join(', ')}`);
        // }
    }

    // #endregion
}
