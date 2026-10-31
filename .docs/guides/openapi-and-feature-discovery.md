---
title: OpenAPI & Feature Discovery
description: Set up multi-document Swagger UI, annotate controllers with the @Api decorator, and use @SwaggerFeature for automatic per-module documentation discovery.
order: 16
---

# OpenAPI & Feature Discovery

This guide covers the full lifecycle of API documentation with `platform-openapi`: installing the package, configuring environment variables, annotating controllers, registering feature modules, and bootstrapping the multi-document Swagger UI.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-openapi
```

---

## Configuration

### Environment Variables

All four variables are **required**:

```dotenv
APP_VERSION=1.0.0
SWAGGER_CONTACT_NAME=Your Team
SWAGGER_CONTACT_URL=https://yourcompany.com
SWAGGER_CONTACT_EMAIL=api@yourcompany.com
```

| Variable                | Purpose                                            |
| ----------------------- | -------------------------------------------------- |
| `APP_VERSION`           | Version shown in every generated OpenAPI document. |
| `SWAGGER_CONTACT_NAME`  | Contact name in the info block.                    |
| `SWAGGER_CONTACT_URL`   | Contact URL in the info block.                     |
| `SWAGGER_CONTACT_EMAIL` | Contact email in the info block.                   |

---

## Overview: How It Works

```
  @SwaggerFeature()        SwaggerFeatureDiscovery       SwaggerFeatureRegistry       SwaggerMultiDocumentService
  ──────────────────       ──────────────────────       ──────────────────────       ───────────────────────────
  Decorator stores          Reads global store and       Holds finalized list of      Builds per-feature OpenAPI
  metadata in global        registers features into      features. Sorted, locked,    documents, sets up Swagger
  store at import time.     the registry.                immutable after finalize().  UI routes, and index page.
```

1. Each feature module is decorated with `@SwaggerFeature()` — metadata is stored globally when the module is imported.
2. During bootstrap, `SwaggerFeatureDiscovery` reads all registered features and pushes them into `SwaggerFeatureRegistry`.
3. `SwaggerMultiDocumentService` finalizes the registry, builds one OpenAPI document per feature (filtered by tag), and mounts Swagger UI + JSON endpoints.

---

## Step 1: Annotate Feature Modules

Decorate each feature module with `@SwaggerFeature()`. This tells the discovery system which tag corresponds to which documentation section.

```typescript
import { Module } from '@nestjs/common';
import { SwaggerFeature } from '@pixel-brewery/archipel-platform-openapi';
import { TipDraftRequest } from './dto/TipDraftRequest.js';
import { TipController } from './TipController.js';
import { TipService } from './TipService.js';

@SwaggerFeature({
    name: 'tip',
    title: 'My App API — Tips',
    description: 'API endpoints for tip management.',
    tag: 'Tip',
    tags: ['Tip'],
    strictModels: [TipDraftRequest],
})
@Module({
    controllers: [TipController],
    providers: [TipService],
    exports: [TipService],
})
export class TipModule {}
```

| Property       | Required | Description                                                                  |
| -------------- | -------- | ---------------------------------------------------------------------------- |
| `name`         | Yes      | Short identifier used for the URL path (e.g. `docs/tip`).                    |
| `title`        | Yes      | Human-readable title shown in the Swagger UI header.                         |
| `description`  | Yes      | Description shown in the Swagger UI header and on the index page.            |
| `tag`          | Yes      | Primary OpenAPI tag — operations with this tag are included in the document. |
| `tags`         | Yes      | Array of all tags to include. Usually `[tag]`.                               |
| `extraModels`  | No       | Feature-owned DTOs to publish even when no operation references them.        |
| `strictModels` | No       | DTO roots to publish as closed graphs synchronized with portable validators. |
| `path`         | No       | Custom URL path. Defaults to `docs/{name}`.                                  |

### Endpointless and mapped DTO contracts

Use `extraModels` for contracts consumed outside a conventional HTTP operation,
such as UI drafts or assistant payloads. NestJS Swagger still generates their
schemas, and feature filtering retains each declared root plus every schema it
references recursively. The default `all` document receives the deduplicated
union from all registered features.

Mapped types remain the canonical source; no synthetic controller endpoint is
required:

```typescript
import { ApiSchema, PartialType, PickType } from '@nestjs/swagger';

@ApiSchema({ name: 'TipDraft' })
export class TipDraftRequest extends PartialType(PickType(CreateTipRequest, ['title', 'content', 'category'] as const)) {}
```

To reuse the same DTO definition as a self-contained JSON Schema contract, call
`createJsonSchemaFromOpenApiModel()`:

```typescript
import { createJsonSchemaFingerprint, createJsonSchemaFromOpenApiModel } from '@pixel-brewery/archipel-platform-openapi';

const schema = createJsonSchemaFromOpenApiModel(TipDraftRequest, {
    additionalProperties: false,
});
const fingerprint = createJsonSchemaFingerprint(schema);
```

The converter uses NestJS Swagger's generated model graph and effective
`@ApiSchema` names. It includes only recursively reachable components under
`$defs`, rewrites their references, and converts OpenAPI `nullable` flags into
JSON Schema null unions. The same portable `class-validator` constraints used
by strict OpenAPI documents are synchronized into this model-facing contract.
Missing component schemas and conflicting DTO, enum, Swagger, or validator
definitions fail immediately. The `additionalProperties` option closes object
schemas only where the DTO did not already declare a policy.

`createJsonSchemaFingerprint()` binds a deployed consumer to the normalized
validation semantics of that bundle. It ignores annotations such as examples
and descriptions, but any effective validation change produces a new SHA-256
fingerprint. This is useful for assistant actions and other runtime-negotiated
contracts where a matching name alone is not sufficient evidence of
compatibility.

Use `strictModels` when OpenAPI is also an executable browser or assistant
contract. Strict roots are published even without an endpoint, their complete
reachable object graph rejects unknown properties, and portable
`class-validator` constraints are copied into the OpenAPI schemas. Conflicting
Swagger and validator constraints stop document generation, preventing a
backend/frontend contract split.

---

## Step 2: Annotate Controllers with `@Api()`

`@Api()` is a convenience decorator that combines multiple `@nestjs/swagger` decorators into one. Use it on methods or classes to keep controller annotations concise.

```typescript
import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { Api } from '@pixel-brewery/archipel-platform-openapi';
import { CreateTipRequest } from './dto/CreateTipRequest.js';
import { TipResponse } from './dto/TipResponse.js';

@Controller('api/v1/tips')
export class TipController {
    @Get()
    @Api({
        tags: 'Tip',
        operation: { summary: 'List all tips' },
        responses: [{ status: 200, description: 'Tips retrieved.', type: [TipResponse] }],
    })
    public listTips(): Promise<TipResponse[]> {
        // ...
    }

    @Get(':tipId')
    @Api({
        tags: 'Tip',
        auth: 'bearer',
        operation: { summary: 'Get a tip by ID' },
        params: { name: 'tipId', type: String },
        responses: [
            { status: 200, description: 'Tip found.', type: TipResponse },
            { status: 404, description: 'Tip not found.' },
        ],
    })
    public getTip(@Param('tipId') tipId: string): Promise<TipResponse> {
        // ...
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @Api({
        tags: 'Tip',
        auth: 'bearer',
        operation: { summary: 'Create a new tip' },
        body: { type: CreateTipRequest },
        responses: [
            { status: 201, description: 'Tip created.', type: TipResponse },
            { status: 400, description: 'Validation failed.' },
        ],
    })
    public createTip(@Body() body: CreateTipRequest): Promise<TipResponse> {
        // ...
    }
}
```

### `@Api()` Options Reference

| Option        | Type                                         | Description                                                                                                                      |
| ------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `auth`        | `ApiAuthOption \| ApiAuthOption[]`           | Auth scheme(s). Simple string (`'bearer'`) or named (`{ type: 'bearer', name: 'jwt' }`). Supports multiple simultaneous schemes. |
| `tags`        | `string \| string[]`                         | OpenAPI tag(s) for the operation.                                                                                                |
| `operation`   | `ApiOperationOptions`                        | Summary, description, operationId, deprecation flag, etc.                                                                        |
| `summary`     | `string`                                     | Shorthand for `operation.summary`. Takes precedence when both are set.                                                           |
| `deprecated`  | `boolean`                                    | Shorthand to mark the endpoint as deprecated. Merged into `operation`.                                                           |
| `responses`   | `ApiResponseOptions \| ApiResponseOptions[]` | One or more response definitions.                                                                                                |
| `headers`     | `ApiHeaderOptions[]`                         | Expected request headers.                                                                                                        |
| `params`      | `ApiParamOptions \| ApiParamOptions[]`       | Path parameter definitions.                                                                                                      |
| `query`       | `ApiQueryOptions \| ApiQueryOptions[]`       | Query parameter definitions.                                                                                                     |
| `body`        | `ApiBodyOptions`                             | Request body definition.                                                                                                         |
| `scopes`      | `string[]`                                   | OAuth2 scopes (only relevant when `auth` includes `'oauth2'`).                                                                   |
| `extensions`  | `Record<string, unknown>`                    | Custom OpenAPI extension properties (`x-*`).                                                                                     |
| `consumes`    | `string \| string[]`                         | MIME type(s) the endpoint consumes (e.g. `'multipart/form-data'`).                                                               |
| `produces`    | `string \| string[]`                         | MIME type(s) the endpoint produces (e.g. `'application/pdf'`).                                                                   |
| `extraModels` | `Function \| Function[]`                     | Extra model classes for polymorphic / discriminated-union schemas.                                                               |
| `security`    | `IApiSecurityOption \| IApiSecurityOption[]` | Generic security scheme(s) for custom API keys or non-standard auth.                                                             |
| `exclude`     | `boolean`                                    | Excludes this endpoint from the Swagger documentation when `true`.                                                               |
| `callbacks`   | `ApiCallbacksOptions`                        | OpenAPI callback / webhook definitions.                                                                                          |

NestJS 12 Standard Schema response metadata is supported through the existing
`responses` option:

```typescript
const UserResponseEnvelopeSchema = ResponseReturn2.schema(UserResponseSchema);

@SerializeOptions({ schema: UserResponseEnvelopeSchema })
@Api({
    responses: {
        status: HttpStatus.OK,
        description: 'User found.',
        standardSchema: UserResponseEnvelopeSchema,
    },
})
```

For `ResponseReturn2`, document the complete schema returned by
`ResponseReturn2.schema()` because it describes the real wire body. Use that
same envelope schema on `@SerializeOptions` for runtime serialization. The
component includes `x-archipel-envelope: { version: 2, dataProperty: 'data' }`
so client generators can explicitly recognize and unwrap it instead of relying
on shape heuristics.

---

## Step 3: Bootstrap the Swagger UI

The recommended application bootstrap path is `useOpenApi()` from `platform-bootstrap`. It runs the same feature discovery and multi-document Swagger setup while keeping the startup sequence consistent with the rest of the platform.

```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { PlatformApplication, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { useOpenApi } from '@pixel-brewery/archipel-platform-bootstrap/openapi';
import { useExpressServer } from '@pixel-brewery/archipel-platform-bootstrap/server/express';
import { useSecurity } from '@pixel-brewery/archipel-platform-bootstrap/security';
import { AppModule } from './AppModule.js';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .use(useExpressServer())
        .use(useSecurity({ contentSecurityPolicy: 'swagger-compatible' }))
        .use(useOpenApi())
        .listenFromConfig({ fallbackPort: 3000 });
}

void bootstrap();
```

If you are wiring OpenAPI without `platform-bootstrap`, use the lower-level services directly:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerFeatureDiscovery, SwaggerFeatureRegistry, SwaggerMultiDocumentService } from '@pixel-brewery/archipel-platform-openapi';
import { ConfigService, ContentTemplateEngine, HostService, ResourceManager } from '@pixel-brewery/archipel-platform-core';
import { AppModule } from './AppModule.js';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Resolve services
    const configService = app.get(ConfigService);
    const hostService = app.get(HostService);
    const resourceManager = app.get(ResourceManager);
    const contentTemplateEngine = app.get(ContentTemplateEngine);

    // 1. Discover features
    const featureRegistry = new SwaggerFeatureRegistry();
    const discovery = new SwaggerFeatureDiscovery();
    discovery.registerDiscoveredFeatures(featureRegistry);
    discovery.registerDefaultFeatures(featureRegistry);

    // 2. Setup multi-document Swagger UI
    const swaggerService = new SwaggerMultiDocumentService(app, configService, hostService, featureRegistry, resourceManager, contentTemplateEngine);
    await swaggerService.setupMultipleSwaggerDocuments();

    await app.listen(3000);
}
bootstrap();
```

After bootstrap the following routes are available:

| Route              | What it serves                                      |
| ------------------ | --------------------------------------------------- |
| `/docs`            | Main index page with a searchable feature grid.     |
| `/docs/{name}`     | Swagger UI for a single feature (e.g. `/docs/tip`). |
| `/api/{name}.json` | Raw OpenAPI JSON for a single feature.              |
| `/docs/all`        | Combined Swagger UI with every endpoint.            |
| `/api/all.json`    | Combined OpenAPI JSON.                              |

---

## How Tag Filtering Works

Each feature declares a `tag` (e.g. `'Tip'`). When the document is built:

1. A full OpenAPI document is created from the entire application.
2. All paths that do **not** have an operation tagged with the feature's tag are removed.
3. Schemas referenced by retained operations or declared through the feature's `extraModels` are retained recursively; all others are pruned.
4. The special tag `'*'` (used by the default `all` feature) skips filtering entirely.

This means the `tag` value in `@SwaggerFeature()` must match the `tags` value you pass to `@Api()` on your controllers.

---

## Exporting OpenAPI Specs Programmatically

If you need the generated OpenAPI documents outside of a running HTTP server (e.g. for CI contract checks or SDK generation), use `generateOpenApiDocuments()`:

```typescript
const documents = swaggerService.generateOpenApiDocuments();

for (const { feature, document } of documents) {
    const json = JSON.stringify(document, null, 2);
    writeFileSync(`specs/${feature.name}.json`, json);
}
```

---

## Theme Customization

`SwaggerTheme` loads `swagger.css` and `swagger.js` from the package assets via `ResourceManager`. These files customize the Swagger UI appearance (colors, dark theme, responsive layout). The theme is applied automatically — no additional configuration is needed.

To override the theme, provide your own `swagger.css` / `swagger.js` files through a `FileResourceStrategy` with a higher-priority base path so that `ResourceManager` picks them up before the built-in assets.

---

## Checklist

- [ ] All four environment variables set (`APP_VERSION`, `SWAGGER_CONTACT_*`)
- [ ] Every feature module decorated with `@SwaggerFeature()`
- [ ] Tags in `@SwaggerFeature({ tag })` match tags in `@Api({ tags })`
- [ ] Endpointless feature contracts listed in `@SwaggerFeature({ extraModels })`
- [ ] `SwaggerFeatureDiscovery` called before `setupMultipleSwaggerDocuments()`
- [ ] `registerDefaultFeatures()` called for the combined `/docs/all` document
