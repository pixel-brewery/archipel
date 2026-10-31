---
title: 'Class: SwaggerFeatureDiscovery'
generated: true
editUrl: false
---

# Class: SwaggerFeatureDiscovery

Defined in: [libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts#L20)

Centralizes the discovery of Swagger features declared across backend modules.

## Constructors

### Constructor

```ts
new SwaggerFeatureDiscovery(): SwaggerFeatureDiscovery;
```

#### Returns

`SwaggerFeatureDiscovery`

## Methods

### generateMultiDocumentOpenApi()

```ts
static generateMultiDocumentOpenApi(
   app,
   config,
   host,
   resource,
   content,
   themeConfig?
): IOpenApiFeatureDocument[];
```

Defined in: [libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts#L122)

Generates every discovered OpenAPI feature document without registering routes,
initializing the Nest application, or starting an HTTP listener.

#### Parameters

| Parameter      | Type                                                   | Description                                                       |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `app`          | `INestApplication`                                     | Constructed, but not necessarily initialized, NestJS application. |
| `config`       | `ConfigService`                                        | Configuration service for document metadata.                      |
| `host`         | `HostService`                                          | Host service for server metadata.                                 |
| `resource`     | `ResourceManager`                                      | Resource manager used by the shared Swagger service.              |
| `content`      | `ContentTemplateEngine`                                | Template engine used by the shared Swagger service.               |
| `themeConfig?` | [`ISwaggerThemeConfig`](Interface.ISwaggerThemeConfig) | Optional theme configuration.                                     |

#### Returns

[`IOpenApiFeatureDocument`](Interface.IOpenApiFeatureDocument)[]

Generated feature documents and their feature metadata.

---

### registerDefaultFeatures()

```ts
registerDefaultFeatures(featureRegistry): this;
```

Defined in: [libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts#L54)

Registers the default composite Swagger documents that aggregate the complete API.

#### Parameters

| Parameter         | Type                                                     | Description                                             |
| ----------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `featureRegistry` | [`SwaggerFeatureRegistry`](Class.SwaggerFeatureRegistry) | The registry that collects Swagger feature information. |

#### Returns

`this`

The discovery instance for chaining.

---

### registerDiscoveredFeatures()

```ts
registerDiscoveredFeatures(featureRegistry): this;
```

Defined in: [libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts#L30)

Registers all discovered feature modules in the provided Swagger registry.

#### Parameters

| Parameter         | Type                                                     | Description                                             |
| ----------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `featureRegistry` | [`SwaggerFeatureRegistry`](Class.SwaggerFeatureRegistry) | The registry that collects Swagger feature information. |

#### Returns

`this`

The discovery instance for chaining.

---

### setupMultiDocumentSwagger()

```ts
static setupMultiDocumentSwagger(
   app,
   config,
   host,
   resource,
   content,
   themeConfig?
): Promise<void>;
```

Defined in: [libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/discovery/SwaggerFeatureDiscovery.ts#L97)

Auto-discovers and sets up multi-document Swagger in a single call.
Handles feature discovery, registry setup, and service initialization.

#### Parameters

| Parameter      | Type                                                   | Description                                      |
| -------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `app`          | `INestApplication`                                     | The NestJS application instance                  |
| `config`       | `ConfigService`                                        | Configuration service for reading app settings   |
| `host`         | `HostService`                                          | Host service for determining base URL            |
| `resource`     | `ResourceManager`                                      | Resource manager for loading theme assets        |
| `content`      | `ContentTemplateEngine`                                | Content template engine for rendering HTML       |
| `themeConfig?` | [`ISwaggerThemeConfig`](Interface.ISwaggerThemeConfig) | Optional theme configuration for branding colors |

#### Returns

`Promise`\<`void`\>

Promise resolving when setup is complete

#### Example

```typescript
await SwaggerFeatureDiscovery.setupMultiDocumentSwagger(app, config, host, resource, content, { primary: '#0066cc', secondary: '#003d99' });
```
