# @pixel-brewery/archipel-platform-core

Core backend utilities and shared infrastructure for NestJS applications.

## Features

- **Event system** - Typed publish/subscribe with RxJS via `EventHub`
- **Content templates** - Handlebars-style template compilation
- **Identifier generation** - Pluggable ID strategies (CUID, UUID, GUID)
- **Base classes** - Repository, service, and controller base classes
- **Custom decorators** - NestJS decorators for common patterns, including request hints such as `@Lang()`, `@UserAgent()`, `@IpAddress()` and `@TimeZone()` (canonical IANA zone from the `X-Time-Zone` header)
- **Utilities** - Device parser, dependency-free PNG avatar generator, name generator
- **Sensitive data masking** - `maskSensitive()` / `maskSensitiveFields()` for safe logging of request data
- **HTTP logger middleware** - Automatically masks sensitive fields (passwords, tokens, API keys) in request logs
- **Schema-native responses** - `ResponseReturn2` validates and serializes response data through Standard Schema

## ⚠️ Environment Variables

| Variable      | Required | Default       | Description                             |
| ------------- | -------- | ------------- | --------------------------------------- |
| `APP_URL`     | yes      | -             | Base URL the application is served from |
| `APP_PORT`    | yes      | -             | HTTP port the application listens on    |
| `APP_VERSION` | yes      | -             | Semantic application version            |
| `APP_NAME`    | no       | -             | Application display name                |
| `NODE_ENV`    | no       | `development` | Runtime environment name                |
| `GIT_COMMIT`  | no       | -             | Git commit SHA for traceability         |

## Quick Start

```typescript
import { CoreModule } from '@pixel-brewery/archipel-platform-core';

@Module({
    imports: [CoreModule],
})
export class AppModule {}
```

## Standard Schema Responses

`ResponseReturn2` is the schema-native successor to `ResponseReturnBase`. It keeps
the existing `{ success, status, data, timestamp }` wire envelope, but replaces
the response DTO constructor and `class-transformer` with a Standard Schema.
`ResponseReturnBase` remains available for endpoints that have not migrated yet.

```typescript
import { Get, HttpStatus, SerializeOptions } from '@nestjs/common';
import { ResponseReturn2 } from '@pixel-brewery/archipel-platform-core';
import { Api } from '@pixel-brewery/archipel-platform-openapi';
import { z } from 'zod';

export const UserResponseSchema = z
    .strictObject({
        id: z.string().uuid(),
        displayName: z.string(),
    })
    .meta({ id: 'UserResponse' });
export type UserResponse = z.output<typeof UserResponseSchema>;

const UserResponseEnvelopeSchema = ResponseReturn2.schema(UserResponseSchema);

@Get(':id')
@SerializeOptions({ schema: UserResponseEnvelopeSchema })
@Api({
    responses: {
        status: HttpStatus.OK,
        description: 'User found.',
        standardSchema: UserResponseEnvelopeSchema,
    },
})
public async getUser(): Promise<ResponseReturn2<UserResponse>> {
    const user = await this._userService.getUser();
    return ResponseReturn2.ok(UserResponseSchema, user);
}
```

The application must register Nest's
`StandardSchemaSerializerInterceptor`. `ResponseReturn2.ok()` also validates
and transforms `data` itself, so the helper cannot emit an unvalidated payload.
The interceptor validates the complete envelope and removes undeclared fields.

The factory controls the `status` field inside the body; it does not override
Nest's HTTP status. Controller metadata must match it: `ok()` uses 200,
`created()` uses 201, and `accepted()` requires
`@HttpCode(HttpStatus.ACCEPTED)` (as does `ok()` on a POST route whose Nest
default would otherwise be 201).

Use the same `UserResponseSchema` object for `ResponseReturn2.ok()` and
`ResponseReturn2.schema()`. The helper marks the validated response with that
exact schema identity so Nest's serializer can validate the envelope without
running a non-idempotent data transform twice.

OpenAPI must receive `UserResponseEnvelopeSchema` because it describes the
actual HTTP body. The generated envelope component carries
`x-archipel-envelope: { version: 2, dataProperty: 'data' }`, allowing compatible
client generators to unwrap the data model without guessing from its shape.

For `204 No Content`, use `@HttpCode(HttpStatus.NO_CONTENT)`, return
`Promise<void>`, and do not attach an envelope serializer or a response schema
with content:

```typescript
@HttpCode(HttpStatus.NO_CONTENT)
public async deleteUser(): Promise<void> {
    await this._userService.deleteUser();
    return ResponseReturn2.noContent();
}
```

### ResponseReturnBase to ResponseReturn2 Migration

```typescript
// Legacy fallback: class-transformer response DTO
return ResponseReturnBase.ok(UserResponse, user);

// ResponseReturn2: Standard Schema response model
return ResponseReturn2.ok(UserResponseSchema, user);
```

Migrate one endpoint at a time. Keep the legacy class-based response until its
Standard Schema, runtime serializer metadata, OpenAPI contract, and generated
client have all been verified together.

## Import Options

```typescript
// Main import
import { EventHub, SseHub, ContentTemplate } from '@pixel-brewery/archipel-platform-core';

// Avatar generation (tree-shakable sub-export)
import { AvatarGeneratorService } from '@pixel-brewery/archipel-platform-core/avatar';

// Device parsing
import { DeviceParser } from '@pixel-brewery/archipel-platform-core/device';

// MIME utilities
import { MimeUtils } from '@pixel-brewery/archipel-platform-core/mime-utils';
```

The avatar generator uses only Node.js runtime modules and emits a standards-compliant transparent RGBA PNG. It does not require a native canvas dependency.

## Error Handling

| Error Class                      | When Thrown                           |
| -------------------------------- | ------------------------------------- |
| `TemplateValidationErrorBase`    | Base class for template errors        |
| `UnmatchedBlockError`            | Unmatched block in template           |
| `MissingPlaceholderError`        | Required template placeholder missing |
| `GeneralTemplateValidationError` | Other template validation failures    |

`ProblemDetailException` can carry response headers that belong to the problem, such as `Retry-After` or `WWW-Authenticate`. `ProblemDetailExceptionFilter` sends them together with the problem; `Content-Type`, `Content-Length`, and `Transfer-Encoding` stay reserved for the filter, and a header with an invalid name or value is skipped and logged without its value.

```typescript
throw new ProblemDetailException(
    HttpStatus.TOO_MANY_REQUESTS,
    { title: 'Rate Limit Exceeded', detail: 'Too many requests.', code: 'RATE_LIMIT' },
    { headers: { 'Retry-After': '42' } },
);
```

## Resource Limits

| Limit             | Value  | Description                                  |
| ----------------- | ------ | -------------------------------------------- |
| `SseHub` subjects | 10,000 | Maximum event subjects; throws when exceeded |
| Max request body  | 1 MB   | `LimitRequestSizeMiddleware` default cap     |

## Lifecycle

- **Shutdown (`OnModuleDestroy`):** `EventHub` and `SseHub` clean up subscriptions.

## Peer Dependencies

| Package             | Required | Notes                  |
| ------------------- | -------- | ---------------------- |
| `@nestjs/common`    | Yes      | NestJS core            |
| `@nestjs/swagger`   | Yes      | OpenAPI decorators     |
| `class-transformer` | Yes      | DTO transformation     |
| `class-validator`   | Yes      | DTO validation         |
| `express`           | Yes      | HTTP server types      |
| `rxjs`              | Yes      | Reactive event streams |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-core/index.md`](../../.docs/packages/platform-core/index.md)

## Development

```bash
# Build
yarn nx build platform-core

# Test
yarn nx test platform-core

# Lint
yarn nx lint platform-core
```
