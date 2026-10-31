# @pixel-brewery/archipel-platform-health

Health check orchestration for NestJS applications built on top of `@nestjs/terminus`.

## Features

- **Indicator-based architecture** — Implement `IHealthIndicator` for each subsystem
- **Aggregated checks** — `HealthOrchestrator.check()` runs all registered indicators
- **Terminus integration** — Built on `@nestjs/terminus` for standard health endpoints
- **Declarative registration** — `HealthModule.withIndicators()` for module-level setup

## Quick Start

```typescript
import { HealthModule, HealthOrchestrator, IHealthIndicator } from '@pixel-brewery/archipel-platform-health';

class DatabaseHealthIndicator implements IHealthIndicator {
    public readonly name = 'database';

    public async isHealthy(): Promise<IHealthCheckResult> {
        return { status: 'up' };
    }
}

@Module({
    imports: [HealthModule.withIndicators([DatabaseHealthIndicator])],
})
export class AppModule {}
```

## Resource Limits

| Limit          | Value | Description                                           |
| -------------- | ----- | ----------------------------------------------------- |
| Max indicators | 100   | `HealthOrchestrator` rejects registrations beyond 100 |

## Peer Dependencies

| Package            | Required | Notes                  |
| ------------------ | -------- | ---------------------- |
| `@nestjs/common`   | Yes      | NestJS core            |
| `@nestjs/terminus` | Yes      | Health check framework |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-health/index.md`](../../.docs/packages/platform-health/index.md)

## Development

```bash
# Build
yarn nx build platform-health

# Test
yarn nx test platform-health

# Lint
yarn nx lint platform-health
```
