# @pixel-brewery/archipel-platform-logging

Configurable logging module for NestJS with log-level management, request-scoped context propagation, and structured logging.

## Features

- **Log-level management** — Configurable via `APP_LOG_LEVEL` with startup validation
- **Request context propagation** — `RequestContextStore` (AsyncLocalStorage-based) stores a per-request `requestId` and optional `userId`
- **Request ID middleware** — `RequestIdMiddleware` extracts or generates a `x-request-id` header and wraps the request in a context store
- **Structured logger** — `ContextLogger` enriches every log entry with the current request context automatically

## ⚠️ Environment Variables

| Variable        | Required | Default | Description   |
| --------------- | -------- | ------- | ------------- |
| `APP_LOG_LEVEL` | no       | `warn`  | Logging level |

> **Startup validation:** The module validates `APP_LOG_LEVEL` at initialization. If the value is not one of `debug`, `info`, `warn`, or `error`, the module logs a warning and falls back to `warn`.

## Quick Start

```typescript
import { LoggerModule } from '@pixel-brewery/archipel-platform-logging';
import { RequestIdMiddleware } from '@pixel-brewery/archipel-platform-logging';

// 1. Import the module
@Module({
    imports: [LoggerModule],
})
export class AppModule implements NestModule {
    // 2. Apply the request ID middleware
    public configure(consumer: MiddlewareConsumer): void {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
    }
}
```

```typescript
// 3. Use ContextLogger in services
import { ContextLogger } from '@pixel-brewery/archipel-platform-logging';

@Injectable()
export class OrderService {
    private readonly _logger = new ContextLogger(OrderService.name);

    public async placeOrder(dto: CreateOrderDto): Promise<void> {
        this._logger.log('Placing order', { orderId: dto.orderId });
        // Log output automatically includes requestId + userId
    }
}
```

## Peer Dependencies

| Package          | Required | Notes                                    |
| ---------------- | -------- | ---------------------------------------- |
| `@nestjs/common` | Yes      | NestJS core                              |
| `express`        | Yes      | Required for `RequestIdMiddleware` types |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-logging/index.md`](../../.docs/packages/platform-logging/index.md)

## Development

```bash
# Build
yarn nx build platform-logging

# Test
yarn nx test platform-logging

# Lint
yarn nx lint platform-logging
```
