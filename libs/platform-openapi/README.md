# @pixel-brewery/archipel-platform-openapi

Multi-tenant Swagger/OpenAPI documentation system with feature-scoped discovery, customizable themes, and automatic endpoint registration.

## Features

- **Feature-scoped documents** — `@SwaggerFeature` decorator for per-module Swagger docs
- **Endpointless contracts** — Feature-owned DTO schemas remain available without synthetic controller routes
- **Strict DTO graphs** — Closed object contracts synchronized with portable `class-validator` constraints
- **Per-endpoint metadata** — `@Api` decorator for OpenAPI annotations
- **Standard Schema responses** — `@Api` forwards NestJS 12 `standardSchema` response metadata
- **Multi-document generation** — `SwaggerMultiDocumentService` for separate feature APIs
- **JSON Schema bundles** — Convert Swagger DTO graphs into self-contained `$defs` contracts
- **Validation fingerprints** — Bind deployed clients to the exact normalized payload contract
- **Customizable themes** — `SwaggerTheme` with CSS/JS asset caching
- **Auto-discovery** — `SwaggerFeatureDiscovery` scans modules automatically
- **Spec export** — Export OpenAPI spec as JSON/YAML for CI contract checks

## ⚠️ Environment Variables

| Variable                | Required | Default | Description              |
| ----------------------- | -------- | ------- | ------------------------ |
| `APP_VERSION`           | yes      | -       | Version shown in Swagger |
| `SWAGGER_CONTACT_NAME`  | yes      | -       | Contact name             |
| `SWAGGER_CONTACT_URL`   | yes      | -       | Contact URL              |
| `SWAGGER_CONTACT_EMAIL` | yes      | -       | Contact email            |

## Quick Start

```typescript
import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import {
    createJsonSchemaFingerprint,
    createJsonSchemaFromOpenApiModel,
    JSON_SCHEMA_FINGERPRINT_ALGORITHM,
    SwaggerFeature,
} from '@pixel-brewery/archipel-platform-openapi';

class CreateAssistantDraftRequest {
    @ApiProperty()
    public title!: string;
}

@ApiSchema({ name: 'AssistantDraft' })
class AssistantDraft extends PartialType(CreateAssistantDraftRequest) {}

@SwaggerFeature({
    name: 'assistant',
    title: 'Assistant contracts',
    description: 'Contracts used by the assistant UI.',
    tag: 'Assistant',
    tags: ['Assistant'],
    strictModels: [AssistantDraft],
})
class AssistantModule {}

const assistantDraftSchema = createJsonSchemaFromOpenApiModel(AssistantDraft, {
    additionalProperties: false,
});
const assistantDraftFingerprint = createJsonSchemaFingerprint(assistantDraftSchema);
const assistantDraftFingerprintAlgorithm = JSON_SCHEMA_FINGERPRINT_ALGORITHM;
```

## Standard Schema Responses

NestJS 12 response schemas can be passed directly through `@Api`:

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

For `ResponseReturn2` endpoints, pass the same complete envelope schema to
`@SerializeOptions` and `standardSchema`. OpenAPI describes the actual HTTP
body; it must not publish only the inner data schema. The envelope component is
marked with `x-archipel-envelope: { version: 2, dataProperty: 'data' }` so client
generators can deliberately unwrap the data model when their runtime already
handles the envelope.

`extraModels` are passed to NestJS Swagger for the owning feature and to the
deduplicated `all` document. Feature filtering retains each root model and all
of its recursively referenced schemas even when no endpoint uses the contract.

`SwaggerFeatureDiscovery.generateMultiDocumentOpenApi()` generates the same
discovered feature documents without registering HTTP routes, initializing the
Nest application, or starting a listener. Build-time client generation can
therefore consume authoritative local contracts without executing application
lifecycle hooks. Call `SwaggerMultiDocumentService.generateOpenApiDocuments()`
directly when the caller already owns a configured feature registry.

`strictModels` are automatically published like `extraModels`, recursively set
`additionalProperties: false`, and mirror portable `class-validator`
constraints such as string/array bounds, numeric ranges, formats, uniqueness,
and regular-expression patterns. An explicit Swagger constraint that conflicts
with the validator metadata fails document generation instead of publishing
divergent backend and generated-client contracts.

`createJsonSchemaFromOpenApiModel()` uses the same Swagger metadata, including
mapped types and custom `@ApiSchema` names. It rewrites reachable component
references into a self-contained `$defs.__openapi_components__.$defs` namespace,
preserves root-local definitions without collisions, and normalizes OpenAPI
`nullable: true` plus an explicit sibling `type` into the canonical JSON Schema
type union containing `null`. Nullable schemas without a valid explicit type
fail closed instead of producing a generator-specific `anyOf`; an `allOf` or
`$ref` composition alone does not imply a sibling type. Component-local pointers
are rebased into their bundled component scope, including cyclic and subpath
references. Portable
`class-validator` constraints are synchronized by the same fail-fast contract
engine used by `strictModels`. Missing references, reserved namespace
collisions, schema-name collisions, and conflicting constraints throw before a
partial contract can be returned. Pass `{ additionalProperties: false }` to
close generated object schemas that do not already declare an explicit policy.

`createJsonSchemaFingerprint()` produces a stable lowercase SHA-256 fingerprint
for the validation semantics of a self-contained JSON Schema 2020-12 document.
It supports boolean schemas and `$ref` siblings, canonicalizes local JSON
Pointers and unordered validation collections, and excludes known annotations
such as descriptions, examples, defaults, and OpenAPI vendor extensions. A
documentation-only edit therefore remains compatible, while a changed bound,
format, enum, required property, nested reference, or other validation rule
changes the fingerprint. Unknown keywords, external references, unsupported
dialects, and non-JSON values fail closed. Persist or transport
`JSON_SCHEMA_FINGERPRINT_ALGORITHM` together with every fingerprint and reject
an unknown algorithm before comparing hashes.

## Peer Dependencies

| Package           | Required | Notes                                     |
| ----------------- | -------- | ----------------------------------------- |
| `@nestjs/common`  | Yes      | NestJS core                               |
| `@nestjs/swagger` | Yes      | Version 11.3+ for model schema generation |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-openapi/index.md`](../../.docs/packages/platform-openapi/index.md)

## Development

```bash
# Build
yarn nx build platform-openapi

# Test
yarn nx test platform-openapi

# Lint
yarn nx lint platform-openapi
```
