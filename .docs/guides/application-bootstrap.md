---
title: Application Bootstrap
description: Compose NestJS startup concerns with platform-bootstrap, Express middleware, security, sessions, OpenAPI, and typed configuration.
order: 3
---

# Application Bootstrap

`platform-bootstrap` standardizes the small but important code that usually accumulates in `main.ts`: global API prefix, Standard Schema and legacy validation, response serialization, filters, Express middleware, CORS, Helmet, sessions, rate limiting, Swagger UI, app initialization, and HTTP listening.

The consuming application still owns `NestFactory`, the HTTP adapter, and the concrete Nest application type. This keeps serverless and Vercel entrypoints explicit while moving reusable startup concerns into composable `PlatformBootstrapStep` functions.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-bootstrap @nestjs/platform-express express compression helmet express-rate-limit express-session
```

Most Archipel applications already install `@nestjs/common`, `@nestjs/core`, `class-validator`, `class-transformer`, `reflect-metadata`, and `rxjs` through their NestJS setup.

---

## Root Module Configuration

Register the bootstrap configuration entries in the root module so `ConfigRegistry` can validate and document them with the rest of the application config.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { PLATFORM_SECURITY_CONFIG_ENTRIES, PLATFORM_SERVER_CONFIG_ENTRIES, PLATFORM_SESSION_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-bootstrap';

@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: () => new EnvironmentConfigStrategy(),
        }),
        ConfigModule.register('platform-bootstrap/server', PLATFORM_SERVER_CONFIG_ENTRIES),
        ConfigModule.register('platform-bootstrap/security', PLATFORM_SECURITY_CONFIG_ENTRIES),
        ConfigModule.register('platform-bootstrap/session', PLATFORM_SESSION_CONFIG_ENTRIES),
    ],
})
export class AppModule {}
```

| Entry                              | Keys                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `PLATFORM_SERVER_CONFIG_ENTRIES`   | `PORT`                                                                       |
| `PLATFORM_SECURITY_CONFIG_ENTRIES` | `APP_CORS_ORIGIN`, `APP_RATE_LIMIT_WINDOW_MS`, `APP_RATE_LIMIT_MAX_REQUESTS` |
| `PLATFORM_SESSION_CONFIG_ENTRIES`  | `AUTH_SESSION_SECRET`, `AUTH_SESSION_SECURE`, `AUTH_SESSION_MAX_AGE`         |

`AUTH_SESSION_SECRET` is required when `useSession()` is part of the pipeline. The other entries provide documented defaults or host-provided values.

---

## Bootstrap Entry Point

Keep the adapter and app type visible in `main.ts`. The builder receives the already-created Nest app and applies ordered steps.

```typescript
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { PlatformApplication, PlatformProcessGuard, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { useOpenApi } from '@pixel-brewery/archipel-platform-bootstrap/openapi';
import { useExpressServer } from '@pixel-brewery/archipel-platform-bootstrap/server/express';
import { useSecurity } from '@pixel-brewery/archipel-platform-bootstrap/security';
import { useSession } from '@pixel-brewery/archipel-platform-bootstrap/session';
import { AppModule } from './AppModule.js';

const processGuard = PlatformProcessGuard.install({ logger: new Logger('Process') });

async function main(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
        logger: new ConsoleLogger({
            prefix: 'API',
            colors: true,
            forceConsole: true,
            compact: true,
            sorted: true,
        }),
    });

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .use(useExpressServer({ json: { limit: '1mb' }, urlEncoded: { extended: true, limit: '1mb' } }))
        .use(useSecurity({ contentSecurityPolicy: 'swagger-compatible' }))
        .use(useSession())
        .use(useOpenApi())
        .listenFromConfig({ fallbackPort: 3000 });
}

main().catch((error: unknown) => processGuard.terminate(error, 'startup'));
```

`listenFromConfig()` resolves the listening port from `PORT`, then `APP_PORT`, then `fallbackPort`. This matches hosted environments that inject `PORT` while preserving a local development default.

---

## Fatal Errors And Broken Output Streams

`PlatformProcessGuard` is installed once, at module level, before the application is created. It is not a bootstrap step: it must also cover failures during composition and, for serverless entrypoints, requests that create the application lazily.

- **Uncaught exceptions** are reported once through the configured logger. stdout and stderr then get up to `flushTimeoutMs` (default 1000 ms) to flush, and the process exits with code 1, so that a supervisor or serverless platform replaces it.
- **Unhandled promise rejections** follow `unhandledRejection`. The default `'fatal'` treats them like uncaught exceptions, matching the Node.js default. `'log'` reports every rejection and keeps the process running.
- **Closed standard streams** (`EPIPE`, `ERR_STREAM_DESTROYED` on stdout or stderr) are ignored, because the reader is gone and reporting them would write to the same broken stream. Any other stream failure is fatal.
- **`terminate(error, origin)`** uses the same path for errors the application catches itself, such as a failed startup.

Only the first fatal error is reported; later ones, including failures raised by the report itself, are ignored while the process exits. A logger that throws or rejects never blocks the exit.

Do not register your own `uncaughtException` listener that only logs. Any listener switches off the Node.js default crash, so the process continues in an undefined state. If that listener logs a closed-pipe error, each report raises the next one, and with the NestJS console logger, which writes message and stack separately, the process spins at full CPU without serving requests.

Choose `unhandledRejection: 'log'` deliberately and document why: it fits only when the known rejection sources leave the process consistent, for example detached side effects that start after their transaction committed. Give those sources their own error handling rather than relying on the log.

```typescript
const processGuard = PlatformProcessGuard.install({
    logger: new Logger('Process'),
    unhandledRejection: 'log',
});
```

---

## Built-In Steps

| Step                 | Import                                                      | Responsibility                                                                                       |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `useApi()`           | `@pixel-brewery/archipel-platform-bootstrap`                | Global prefix, Standard Schema and legacy validation, response serialization, and exception filters. |
| `useExpressServer()` | `@pixel-brewery/archipel-platform-bootstrap/server/express` | JSON parser, URL-encoded parser, and compression middleware.                                         |
| `useSecurity()`      | `@pixel-brewery/archipel-platform-bootstrap/security`       | CORS, Helmet, content security policy, and rate limiting.                                            |
| `useSession()`       | `@pixel-brewery/archipel-platform-bootstrap/session`        | Express-compatible session middleware backed by typed config keys.                                   |
| `useOpenApi()`       | `@pixel-brewery/archipel-platform-bootstrap/openapi`        | Multi-document Swagger UI discovery and setup.                                                       |

Use the steps in the order requests should pass through middleware: parser and security first, session before authenticated routes, OpenAPI after modules and decorators are loaded.

### Standard Schema defaults

`useApi()` registers these paths together by default:

- the legacy `ValidationPipe` for existing decorated class DTOs;
- `StandardSchemaValidationPipe` for schema-native request contracts, returning
  422 for validation failures;
- `StandardSchemaSerializerInterceptor` for response contracts declared with
  `@SerializeOptions({ schema })`.

They remain independently configurable during migration:

```typescript
useApi({
    validation: true,
    standardSchema: {
        requestValidation: { errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY },
        responseSerialization: {},
    },
});
```

Set `standardSchema: false` to disable both schema-native paths, or set
`requestValidation` / `responseSerialization` to `false` individually. Object
options are forwarded to the corresponding Nest 12 pipe or interceptor. The
legacy `validation` option is independent and remains backward compatible.
When migrating an app that registered either Standard Schema component
manually, remove that manual registration or set `standardSchema: false` to
avoid running validation or serialization twice. Both default request pipes use
422; override `standardSchema.requestValidation.errorHttpStatusCode` only when
the API contract intentionally requires another status.

For inactivity-based browser sessions, opt into rolling cookies so each handled request renews the configured cookie lifetime:

```typescript
await PlatformApplication.from(app)
    .use(useSession({ rolling: true }))
    .listenFromConfig({ fallbackPort: 3000 });
```

The option defaults to `false` and forwards the matching `express-session` behavior. `AUTH_SESSION_MAX_AGE` continues to define the maximum age applied to the renewed cookie.

---

## Custom Steps

Application-specific startup logic can live in a local `use*` factory. A step receives the `PlatformBootstrapContext`, performs its work, and calls `next()` to continue the pipeline.

```typescript
import { INestApplication } from '@nestjs/common';
import { PlatformBootstrapStep } from '@pixel-brewery/archipel-platform-bootstrap';

export function useShutdownHooks<TApplication extends INestApplication = INestApplication>(): PlatformBootstrapStep<TApplication> {
    return async function shutdownHooksStep(context, next): Promise<void> {
        context.app.enableShutdownHooks();
        await next();
    };
}
```

Then place it where the behavior belongs:

```typescript
await PlatformApplication.from(app)
    .use(useApi({ prefix: 'api' }))
    .use(useShutdownHooks())
    .use(useOpenApi())
    .listenFromConfig({ fallbackPort: 3000 });
```

---

## Testing Bootstrap Behavior

The testing subpath exposes a lightweight application double for step-order and middleware assertions.

```typescript
import { describe, expect, it } from 'vitest';
import { PlatformApplication, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { createPlatformTestApplication } from '@pixel-brewery/archipel-platform-bootstrap/testing';

it('applies API bootstrap before initialization', async (): Promise<void> => {
    const app = createPlatformTestApplication();

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .initialize();

    expect(app.calls).toContain('setGlobalPrefix');
    expect(app.calls.at(-1)).toBe('init');
});
```

For full HTTP behavior, keep using Supertest against a real Nest application. The test helper is for the composition layer itself, not controller or middleware integration coverage.

---

## Production Checklist

- Register all bootstrap config entries in the root module.
- Keep `NestFactory.create()` in the application entrypoint so the adapter remains explicit.
- Use `useSecurity({ contentSecurityPolicy: 'swagger-compatible' })` when serving Swagger UI.
- Set `AUTH_SESSION_SECRET` in every environment that enables `useSession()`.
- Prefer `listenFromConfig()` for deployed HTTP apps and `initialize()` for serverless handler exports or composition tests.

See the [Bootstrap Pattern](/patterns/bootstrap-pattern) for the reusable design rules behind this package.
