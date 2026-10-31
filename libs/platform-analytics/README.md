# @pixel-brewery/archipel-platform-analytics

Provider-agnostic analytics and error tracking infrastructure for NestJS.

## Features

- **Multi-provider** — Sentry, Application Insights, Datadog, and No-op out of the box
- **abstract bases and adapters pattern** — Swap providers without changing consumer code via `AnalyticsClientBase`
- **Graceful lifecycle** — SDK init deferred to `OnModuleInit`; pending events flushed on `OnModuleDestroy`
- **NestJS integration** — `AnalyticsModule.register()` with typed config entries
- **Health checks** — `AnalyticsHealthIndicator` for readiness probes (separate `/health` subpath)

## ⚠️ Environment Variables

### Sentry

| Variable             | Required | Default | Description             |
| -------------------- | -------- | ------- | ----------------------- |
| `SENTRY_DSN`         | yes      | -       | Sentry Data Source Name |
| `SENTRY_ENVIRONMENT` | no       | -       | Sentry environment tag  |

### Application Insights

| Variable                                | Required | Default | Description                            |
| --------------------------------------- | -------- | ------- | -------------------------------------- |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | yes      | -       | Application Insights connection string |

### Datadog

| Variable     | Required | Default | Description          |
| ------------ | -------- | ------- | -------------------- |
| `DD_SERVICE` | yes      | -       | Datadog service name |
| `DD_ENV`     | no       | -       | Datadog environment  |

## Quick Start

```typescript
import { AnalyticsModule, AnalyticsClientBase } from '@pixel-brewery/archipel-platform-analytics';
import { SentryAnalyticsClient, SENTRY_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-analytics/sentry';

@Module({
    imports: [
        AnalyticsModule.register({
            analyticsClient: SentryAnalyticsClient,
            configEntries: SENTRY_CONFIG_ENTRIES,
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
```

## Supported Providers

| Provider             | Client                       | Package               |
| -------------------- | ---------------------------- | --------------------- |
| Sentry               | `SentryAnalyticsClient`      | `@sentry/node`        |
| Application Insights | `AppInsightsAnalyticsClient` | `applicationinsights` |
| Datadog              | `DatadogAnalyticsClient`     | `dd-trace`            |
| No-op (dev/test)     | `NoopAnalyticsClient`        | -                     |

## Import Options

```typescript
// Main import (abstract base, module, no-op client)
import { AnalyticsModule, AnalyticsClientBase, NoopAnalyticsClient } from '@pixel-brewery/archipel-platform-analytics';

// Provider-specific (tree-shakable sub-exports)
import { SentryAnalyticsClient, SENTRY_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-analytics/sentry';
import { AppInsightsAnalyticsClient, APP_INSIGHTS_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-analytics/app-insights';
import { DatadogAnalyticsClient, DATADOG_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-analytics/datadog';

// Health indicator (optional)
import { AnalyticsHealthIndicator } from '@pixel-brewery/archipel-platform-analytics/health';
```

## Abstract Bases

| Abstract Base         | Description                                  |
| --------------------- | -------------------------------------------- |
| `AnalyticsClientBase` | Analytics and error tracking client contract |

## Lifecycle

- **Startup (`OnModuleInit`):** SDK initialization is deferred — no side effects in constructors.
- **Shutdown (`OnModuleDestroy`):** Each client flushes pending events and gracefully closes the SDK connection with a 5-second timeout guard.

## Peer Dependencies

| Package                                   | Required | Notes                         |
| ----------------------------------------- | -------- | ----------------------------- |
| `@nestjs/common`                          | Yes      | NestJS core                   |
| `@sentry/node`                            | No       | Required for Sentry provider  |
| `applicationinsights`                     | No       | Required for App Insights     |
| `dd-trace`                                | No       | Required for Datadog provider |
| `@pixel-brewery/archipel-platform-health` | No       | Required for health indicator |
| `@nestjs/terminus`                        | No       | Required for health indicator |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-analytics/index.md`](../../.docs/packages/platform-analytics/index.md)

## Development

```bash
# Build
yarn nx build platform-analytics

# Test
yarn nx test platform-analytics

# Lint
yarn nx lint platform-analytics
```
