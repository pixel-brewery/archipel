---
title: Bootstrap Pattern
description: Composable NestJS application startup with PlatformApplication, PlatformBootstrapStep, typed config, and ordered use* helpers.
order: 10
---

# Archipel Bootstrap Pattern

## Overview

Application startup is an ordered pipeline. The Nest application is created by the consuming app, then passed into `PlatformApplication.from(app)` so reusable startup concerns can be composed as `PlatformBootstrapStep` functions.

This pattern keeps platform defaults reusable without hiding the HTTP adapter, serverless shape, or application type chosen by the consuming app.

## Canonical Shape

```typescript
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { PlatformApplication, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { useOpenApi } from '@pixel-brewery/archipel-platform-bootstrap/openapi';
import { useExpressServer } from '@pixel-brewery/archipel-platform-bootstrap/server/express';
import { useSecurity } from '@pixel-brewery/archipel-platform-bootstrap/security';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .use(useExpressServer())
        .use(useSecurity({ contentSecurityPolicy: 'swagger-compatible' }))
        .use(useOpenApi())
        .listenFromConfig({ fallbackPort: 3000 });
}

void main();
```

## Step Contract

A `PlatformBootstrapStep` receives a `PlatformBootstrapContext` and a `next` callback. The step may configure the app, resolve services from the app container, and then continue the pipeline.

```typescript
import { PlatformBootstrapStep } from '@pixel-brewery/archipel-platform-bootstrap';

export function useRequestLogging(): PlatformBootstrapStep {
    return async function requestLoggingStep(context, next): Promise<void> {
        context.app.use((request, response, nextMiddleware): void => {
            response.setHeader('x-platform', 'archipel');
            nextMiddleware();
        });

        await next();
    };
}
```

A step should call `await next()` exactly once unless it intentionally terminates startup because of a validation or configuration failure.

## Naming Rules

| Artifact           | Rule                                                                     | Example                                               |
| ------------------ | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| Step factory       | Starts with `use` and describes the application concern.                 | `useSecurity()`                                       |
| Options interface  | Uses the same concern name and ends with `StepOptions`.                  | `ISecurityStepOptions`                                |
| Step function name | Describes the runtime work and ends with `Step`.                         | `securityStep`                                        |
| Import path        | Uses the package root for core types and subpaths for optional concerns. | `@pixel-brewery/archipel-platform-bootstrap/security` |

Do not introduce alternative public names for the same concept. The shared vocabulary is `PlatformApplication`, `PlatformApplicationBuilder`, `PlatformBootstrapContext`, `PlatformBootstrapStep`, and `use*` helpers.

## Ordering Rules

Recommended HTTP API order:

1. `useApi()` for prefix, Standard Schema request validation/response
   serialization, the parallel legacy `ValidationPipe`, and global filters.
2. `useExpressServer()` for parsers and compression.
3. `useSecurity()` for CORS, Helmet, content security policy, and rate limiting.
4. `useSession()` when route handlers or guards need session state.
5. `useOpenApi()` after modules and decorators are loaded.
6. Application-specific steps placed next to the platform step they affect.

The builder executes once. Calling `initialize()`, `run()`, `listen()`, or `listenFromConfig()` reuses the same execution promise, which prevents duplicate middleware registration during concurrent startup paths.

`useApi()` enables Standard Schema by default. Use
`standardSchema.requestValidation` and
`standardSchema.responseSerialization` for Nest 12 option forwarding, set
either child to `false` to disable only that side, or set
`standardSchema: false` to disable both. The separate `validation` option
continues to control only the legacy class-based `ValidationPipe`.
Remove equivalent manual Standard Schema registrations when adopting this
default, otherwise the pipe or interceptor will execute twice.

## Configuration Rules

- Define config keys with `createConfigKey<T>()` in `env.ts`.
- Export grouped config entry arrays, such as `PLATFORM_SERVER_CONFIG_ENTRIES`.
- Register those entries through `ConfigModule.register()` in the root module.
- Resolve config through `ConfigService` inside steps, never through direct environment access.
- Let required entries fail during startup instead of failing on the first request.

## Custom Step Template

```typescript
import { INestApplication } from '@nestjs/common';
import { PlatformBootstrapStep } from '@pixel-brewery/archipel-platform-bootstrap';

export interface IShutdownHooksStepOptions {
    readonly signals?: ReadonlyArray<string>;
}

export function useShutdownHooks<TApplication extends INestApplication = INestApplication>(
    options?: IShutdownHooksStepOptions,
): PlatformBootstrapStep<TApplication> {
    return async function shutdownHooksStep(context, next): Promise<void> {
        context.app.enableShutdownHooks(options?.signals);
        await next();
    };
}
```

Use a generic `TApplication extends INestApplication` when a step needs to preserve the concrete application type. Keep options immutable and optional unless the step cannot operate safely without them.

## Testing Rules

Use the testing subpath for composition tests:

```typescript
import { expect, it } from 'vitest';
import { PlatformApplication, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { createPlatformTestApplication } from '@pixel-brewery/archipel-platform-bootstrap/testing';

it('initializes after applying bootstrap steps', async (): Promise<void> => {
    const app = createPlatformTestApplication();

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .initialize();

    expect(app.calls).toEqual(expect.arrayContaining(['setGlobalPrefix', 'useGlobalPipes', 'useGlobalInterceptors', 'init']));
});
```

Use a real Nest app with Supertest when validating HTTP middleware behavior, route responses, cookies, or Swagger endpoints.

## Checklist

- `NestFactory` remains in the consuming entrypoint.
- Startup concerns are added through `.use(useSomething())`.
- Step option interfaces are named `I*StepOptions`.
- Steps call `await next()` once in the normal path.
- Config entries are registered before the builder reads them.
- `useApi()` Standard Schema and legacy validation options match the consuming application's migration state.
- Swagger-compatible content security policy is enabled when OpenAPI UI is served.
- Tests cover step order and failure behavior for custom steps.
