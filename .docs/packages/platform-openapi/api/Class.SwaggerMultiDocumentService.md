---
title: 'Class: SwaggerMultiDocumentService'
generated: true
editUrl: false
---

# Class: SwaggerMultiDocumentService

Defined in: [libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts#L18)

## Constructors

### Constructor

```ts
new SwaggerMultiDocumentService(
   app,
   configService,
   hostService,
   featureRegistry,
   resourceManager,
   contentTemplateEngine,
   themeConfig?
): SwaggerMultiDocumentService;
```

Defined in: [libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts#L34)

#### Parameters

| Parameter               | Type                                                     |
| ----------------------- | -------------------------------------------------------- |
| `app`                   | `INestApplication`                                       |
| `configService`         | `ConfigService`                                          |
| `hostService`           | `HostService`                                            |
| `featureRegistry`       | [`SwaggerFeatureRegistry`](Class.SwaggerFeatureRegistry) |
| `resourceManager`       | `ResourceManager`                                        |
| `contentTemplateEngine` | `ContentTemplateEngine`                                  |
| `themeConfig?`          | [`ISwaggerThemeConfig`](Interface.ISwaggerThemeConfig)   |

#### Returns

`SwaggerMultiDocumentService`

## Methods

### generateOpenApiDocuments()

```ts
generateOpenApiDocuments(): IOpenApiFeatureDocument[];
```

Defined in: [libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts#L83)

Generates OpenAPI documents for every registered feature without wiring HTTP routes.

#### Returns

[`IOpenApiFeatureDocument`](Interface.IOpenApiFeatureDocument)[]

---

### setupMultipleSwaggerDocuments()

```ts
setupMultipleSwaggerDocuments(): Promise<void>;
```

Defined in: [libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/services/SwaggerMultiDocumentService.ts#L59)

Setup multiple Swagger documents for different features

#### Returns

`Promise`\<`void`\>
