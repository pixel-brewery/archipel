// #region Imports

import type { INestApplication } from '@nestjs/common';
import { ApiProperty, ApiSchema, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type { ContentTemplateEngine, HostService } from '@pixel-brewery/archipel-platform-core';
import type { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { ArrayMaxSize, IsEmail, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SwaggerFeatureRegistry } from '../registry/SwaggerFeatureRegistry.js';
import { SwaggerMultiDocumentService } from './SwaggerMultiDocumentService.js';

// #endregion

// #region Types

class EndpointlessRootModel {}
ApiSchema({ name: 'EndpointlessRoot' })(EndpointlessRootModel);

class StrictNestedModel {
    public email!: string;
}
ApiProperty()(StrictNestedModel.prototype, 'email');
IsEmail()(StrictNestedModel.prototype, 'email');
MaxLength(120)(StrictNestedModel.prototype, 'email');

class StrictRootModel {
    public nested!: StrictNestedModel;

    public tags!: Array<string>;
}
ApiProperty({ type: () => StrictNestedModel })(StrictRootModel.prototype, 'nested');
ValidateNested()(StrictRootModel.prototype, 'nested');
ApiProperty({ type: [String] })(StrictRootModel.prototype, 'tags');
ArrayMaxSize(3)(StrictRootModel.prototype, 'tags');
MinLength(2, { each: true })(StrictRootModel.prototype, 'tags');

// #endregion

// #region Tests

describe('SwaggerMultiDocumentService', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('should pass feature contract models to NestJS Swagger and retain their recursive schemas', () => {
        // arrange
        const sourceDocument: OpenAPIObject = {
            openapi: '3.0.0',
            info: { title: 'Complete API', version: '1.0.0' },
            paths: {
                '/kept': {
                    get: {
                        tags: ['Feature'],
                        responses: {
                            200: {
                                description: 'Kept response',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/PathContract' },
                                    },
                                },
                            },
                        },
                    },
                },
                '/removed': {
                    get: {
                        tags: ['Other'],
                        responses: {
                            200: {
                                description: 'Removed response',
                                content: {
                                    'application/json': {
                                        schema: { $ref: '#/components/schemas/RemovedContract' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            components: {
                schemas: {
                    EndpointlessRoot: {
                        type: 'object',
                        properties: {
                            nested: { $ref: '#/components/schemas/NestedContractModel' },
                        },
                    },
                    NestedContractModel: { type: 'object', properties: { value: { type: 'string' } } },
                    PathContract: { type: 'object', properties: { id: { type: 'string' } } },
                    RemovedContract: { type: 'object', properties: { id: { type: 'string' } } },
                },
            },
            tags: [{ name: 'Feature' }, { name: 'Other' }],
        };
        const createDocument = vi.spyOn(SwaggerModule, 'createDocument').mockReturnValue(sourceDocument);
        const featureRegistry = new SwaggerFeatureRegistry();
        featureRegistry.registerFeature({
            name: 'feature',
            title: 'Feature API',
            description: 'Feature contracts',
            tag: 'Feature',
            tags: ['Feature'],
            extraModels: [EndpointlessRootModel],
            path: 'docs/feature',
        });
        const service = new SwaggerMultiDocumentService(
            {} as INestApplication,
            { get: vi.fn(() => 'test') } as unknown as ConfigService,
            { host: 'https://example.test', stage: 'test' } as unknown as HostService,
            featureRegistry,
            {} as ResourceManager,
            {} as ContentTemplateEngine,
        );

        // act
        const [{ document }] = service.generateOpenApiDocuments();

        // assert
        expect(createDocument.mock.calls[0]?.[2]?.extraModels).toEqual([EndpointlessRootModel]);
        expect(Object.keys(document.paths)).toEqual(['/kept']);
        expect(Object.keys(document.components?.schemas ?? {})).toEqual(['EndpointlessRoot', 'NestedContractModel', 'PathContract']);
        expect(document.tags).toEqual([{ name: 'Feature' }]);
    });

    it('should publish strict roots, close their graph, and synchronize portable validation constraints', () => {
        // arrange
        const sourceDocument: OpenAPIObject = {
            openapi: '3.0.0',
            info: { title: 'Complete API', version: '1.0.0' },
            paths: {},
            components: {
                schemas: {
                    StrictRootModel: {
                        type: 'object',
                        properties: {
                            nested: { $ref: '#/components/schemas/StrictNestedModel' },
                            tags: { type: 'array', items: { type: 'string' } },
                        },
                    },
                    StrictNestedModel: {
                        type: 'object',
                        properties: { email: { type: 'string' } },
                    },
                },
            },
        };
        const createDocument = vi.spyOn(SwaggerModule, 'createDocument').mockReturnValue(sourceDocument);
        const featureRegistry = new SwaggerFeatureRegistry();
        featureRegistry.registerFeature({
            name: 'strict-feature',
            title: 'Strict Feature API',
            description: 'Strict contracts',
            tag: 'Strict Feature',
            tags: ['Strict Feature'],
            strictModels: [StrictRootModel],
            path: 'docs/strict-feature',
        });
        const service = new SwaggerMultiDocumentService(
            {} as INestApplication,
            { get: vi.fn(() => 'test') } as unknown as ConfigService,
            { host: 'https://example.test', stage: 'test' } as unknown as HostService,
            featureRegistry,
            {} as ResourceManager,
            {} as ContentTemplateEngine,
        );

        // act
        const [{ document }] = service.generateOpenApiDocuments();

        // assert
        expect(createDocument.mock.calls[0]?.[2]?.extraModels).toEqual([StrictRootModel]);
        expect(document.components?.schemas).toMatchObject({
            StrictRootModel: {
                additionalProperties: false,
                properties: {
                    tags: {
                        maxItems: 3,
                        items: { minLength: 2 },
                    },
                },
            },
            StrictNestedModel: {
                additionalProperties: false,
                properties: {
                    email: { format: 'email', maxLength: 120 },
                },
            },
        });
    });

    it('should fail document generation when explicit OpenAPI and validator constraints diverge', () => {
        // arrange
        const sourceDocument: OpenAPIObject = {
            openapi: '3.0.0',
            info: { title: 'Complete API', version: '1.0.0' },
            paths: {},
            components: {
                schemas: {
                    StrictRootModel: {
                        type: 'object',
                        properties: {
                            nested: { $ref: '#/components/schemas/StrictNestedModel' },
                            tags: { type: 'array', items: { type: 'string' } },
                        },
                    },
                    StrictNestedModel: {
                        type: 'object',
                        properties: { email: { type: 'string', maxLength: 64 } },
                    },
                },
            },
        };
        vi.spyOn(SwaggerModule, 'createDocument').mockReturnValue(sourceDocument);
        const featureRegistry = new SwaggerFeatureRegistry();
        featureRegistry.registerFeature({
            name: 'strict-conflict',
            title: 'Strict Conflict API',
            description: 'Conflicting contracts',
            tag: 'Strict Conflict',
            tags: ['Strict Conflict'],
            strictModels: [StrictRootModel],
            path: 'docs/strict-conflict',
        });
        const service = new SwaggerMultiDocumentService(
            {} as INestApplication,
            { get: vi.fn(() => 'test') } as unknown as ConfigService,
            { host: 'https://example.test', stage: 'test' } as unknown as HostService,
            featureRegistry,
            {} as ResourceManager,
            {} as ContentTemplateEngine,
        );

        // act / assert
        expect(() => service.generateOpenApiDocuments()).toThrow('OpenAPI constraint mismatch for StrictNestedModel.email: maxLength is 64, expected 120.');
    });
});

// #endregion
