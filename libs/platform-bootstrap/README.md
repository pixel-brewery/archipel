# @pixel-brewery/archipel-platform-bootstrap

Application composition layer for NestJS backends built with Archipel. It centralizes startup concerns that usually drift into app-level `bootstrap.ts` files: API defaults, Express middleware, security, sessions, OpenAPI setup, and test helpers.

The package is intentionally consumed through subpath exports so applications only import the runtime pieces they use.

## Entry Points

| Import                                                      | Purpose                                              |
| ----------------------------------------------------------- | ---------------------------------------------------- |
| `@pixel-brewery/archipel-platform-bootstrap`                | Core builder, API step, process guard, config keys   |
| `@pixel-brewery/archipel-platform-bootstrap/composition`    | Stage-aware module composition context               |
| `@pixel-brewery/archipel-platform-bootstrap/server/express` | Express-compatible body parsing and compression      |
| `@pixel-brewery/archipel-platform-bootstrap/security`       | CORS, Helmet, content-security-policy, rate limiting |
| `@pixel-brewery/archipel-platform-bootstrap/session`        | Express-compatible session middleware                |
| `@pixel-brewery/archipel-platform-bootstrap/openapi`        | Archipel multi-document OpenAPI setup                |
| `@pixel-brewery/archipel-platform-bootstrap/testing`        | Lightweight bootstrap testing helpers                |

## Quick Start

Keep NestJS application creation in your app entrypoint and let Archipel compose the rest:

```typescript
import { ConsoleLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { PlatformApplication, useApi } from '@pixel-brewery/archipel-platform-bootstrap';
import { useExpressServer } from '@pixel-brewery/archipel-platform-bootstrap/server/express';
import { useSecurity } from '@pixel-brewery/archipel-platform-bootstrap/security';
import { useSession } from '@pixel-brewery/archipel-platform-bootstrap/session';
import { useOpenApi } from '@pixel-brewery/archipel-platform-bootstrap/openapi';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
        logger: new ConsoleLogger({ prefix: 'API', colors: true, forceConsole: true, compact: true, sorted: true }),
    });

    await PlatformApplication.from(app)
        .use(useApi({ prefix: 'api' }))
        .use(useExpressServer({ json: { limit: '1mb' }, urlEncoded: { extended: true, limit: '1mb' } }))
        .use(useSecurity({ contentSecurityPolicy: 'swagger-compatible' }))
        .use(useSession())
        .use(useOpenApi())
        .listenFromConfig({ fallbackPort: 3000 });
}

void main();
```

## Fatal Errors And Broken Output Streams

`PlatformProcessGuard` owns the process-level behavior that otherwise accumulates as ad-hoc `process.on(...)` handlers in `main.ts`. Install it once, before the application is created:

```typescript
import { Logger } from '@nestjs/common';
import { PlatformProcessGuard } from '@pixel-brewery/archipel-platform-bootstrap';

const processGuard = PlatformProcessGuard.install({ logger: new Logger('Process') });

main().catch((error: unknown) => processGuard.terminate(error, 'startup'));
```

| Situation                                                 | Behavior                                                                                                                       |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Uncaught exception                                        | Reported once; stdout and stderr get up to `flushTimeoutMs` (default 1000 ms) to flush; then the process exits with code 1.    |
| Unhandled promise rejection                               | `unhandledRejection: 'fatal'` (default) behaves like an uncaught exception. `'log'` reports every rejection and keeps running. |
| Closed stdout or stderr (`EPIPE`, `ERR_STREAM_DESTROYED`) | Ignored. The output is discarded and the process keeps running.                                                                |
| Any other stdout or stderr failure                        | Fatal, like an uncaught exception.                                                                                             |
| `terminate(error, origin)`                                | The same fatal path for errors the application catches itself, for example a failed startup.                                   |

A listener that only logs an uncaught exception switches off the Node.js default crash and leaves the process running in an undefined state. Logging a closed-pipe error writes to the same broken stream, so every report raises the next error; with the NestJS console logger, which writes message and stack separately, that becomes an endless loop at full CPU. The guard prevents both: it reports only the first fatal error, ignores closed standard streams, treats a failing logger as best effort, and always exits.

Choose `unhandledRejection: 'log'` only when the known rejection sources leave the process consistent, for example detached side effects that start after their transaction has committed, and fix those sources instead of relying on the log.

Tests pass an `IPlatformProcess` double through the `process` option, so a fatal path never exits the test runner.

## Configuration Entries

Use the exported config entries with `ConfigModule.register()` so startup fails early when required values are missing.

| Entry                              | Keys                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------- |
| `PLATFORM_SERVER_CONFIG_ENTRIES`   | `PORT`                                                                       |
| `PLATFORM_SECURITY_CONFIG_ENTRIES` | `APP_CORS_ORIGIN`, `APP_RATE_LIMIT_WINDOW_MS`, `APP_RATE_LIMIT_MAX_REQUESTS` |
| `PLATFORM_SESSION_CONFIG_ENTRIES`  | `AUTH_SESSION_SECRET`, `AUTH_SESSION_SECURE`, `AUTH_SESSION_MAX_AGE`         |

`listenFromConfig()` resolves ports in this order by default: `PORT`, then `APP_PORT`, then the provided fallback.

## Rolling Sessions

Enable rolling cookies when the cookie lifetime should be renewed after each request handled by the application:

```typescript
await PlatformApplication.from(app)
    .use(useSession({ rolling: true }))
    .listenFromConfig({ fallbackPort: 3000 });
```

`rolling` forwards the matching `express-session` option. It defaults to `false`; the configured `AUTH_SESSION_MAX_AGE` still defines the cookie lifetime.

## Request Validation And Response Serialization

`useApi()` enables both contract styles during the migration to Standard Schema:

- Nest's `ValidationPipe` continues to validate existing decorated DTO classes.
- Nest 12's `StandardSchemaValidationPipe` validates parameters declared with a Standard Schema.
- Nest 12's `StandardSchemaSerializerInterceptor` validates and transforms responses declared with `@SerializeOptions({ schema })`.

Both validation pipes report invalid requests as HTTP `422 Unprocessable Entity` by default. The Standard Schema integrations are no-ops for routes without schema metadata, so existing endpoints remain compatible.

Use `standardSchema: false` to disable both Standard Schema integrations, or configure them independently. Object values are forwarded to NestJS:

```typescript
await PlatformApplication.from(app)
    .use(
        useApi({
            standardSchema: {
                requestValidation: { transform: true },
                responseSerialization: true,
            },
        }),
    )
    .listenFromConfig({ fallbackPort: 3000 });
```

`useApi()` resolves Nest's `Reflector` from the application container for the serializer interceptor. Consumers do not need to register it manually.

Applications that already register either Standard Schema component manually should remove that duplicate registration when adopting this default, or set the corresponding `standardSchema` option to `false`.

## Stage-Aware Composition

For applications that need to select infrastructure modules based on environment or configuration, use the composition subpath:

```typescript
import { PlatformApplicationBuilder, useApi, CompositionImport } from '@pixel-brewery/archipel-platform-bootstrap';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const builder = await PlatformApplicationBuilder.createWithComposition<NestExpressApplication>(
        async (context) => {
            const imports: CompositionImport[] = [AppModule];

            const driver = context.tryGetConfigValue({ key: 'MAIL_DRIVER' }, 'log');
            if (driver === 'smtp') {
                const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
                imports.push(MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy }));
            }

            return imports;
        },
        {
            appFactory: (module) => NestFactory.create<NestExpressApplication>(module, new ExpressAdapter()),
        },
    );

    await builder.use(useApi({ prefix: 'api' })).listenFromConfig({ fallbackPort: 3000 });
}
```

The composition context bootstraps a lightweight NestJS context with only configuration services, reads environment values, and returns the modules to import. The context is automatically closed after composition completes.

For more complex scenarios, create a custom `CompositionResolverBase` class that encapsulates all provider selection logic.

## Design Notes

- `PlatformApplication.from(app)` wraps an existing NestJS app, which keeps `NestFactory` and platform adapters visible in the consuming `main.ts`.
- Bootstrap functions are named `use*` and return `PlatformBootstrapStep` instances. They compose the application pipeline and can be tested independently.
- Express-specific middleware lives in `server/express` so future server integrations can be added without forcing extra dependencies into the root import.

## Local Development

```bash
yarn nx run platform-bootstrap:build
yarn nx run platform-bootstrap:test
```
