# @pixel-brewery/archipel-platform-configuration

Type-safe configuration management with strategy-based resolution for NestJS applications.

## Features

- **Typed config keys** — Compile-time type safety via `IConfigKey<T>` and `createConfigKey<T>()`
- **Strategy pattern** — Swap configuration sources (environment variables, `.env` files, custom) without changing consumers
- **Global NestJS module** — `ConfigModule.forRoot()` bootstraps a global `ConfigService`; `ConfigModule.register()` declares per-library config entries
- **Central registry** — `ConfigRegistry` collects all registered keys for discovery and validation

## Quick Start

```typescript
import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: () => new EnvironmentConfigStrategy(),
        }),
    ],
})
export class AppModule {}
```

### Defining Config Keys

```typescript
import { createConfigKey } from '@pixel-brewery/archipel-platform-configuration';

export const DATABASE_URL = createConfigKey<string>('DATABASE_URL');
export const CACHE_TTL = createConfigKey<number>('CACHE_TTL');
```

### Registering Library Entries

```typescript
ConfigModule.register('my-library', [
    { key: DATABASE_URL, required: true, description: 'PostgreSQL connection string' },
    { key: CACHE_TTL, required: false, defaultValue: 3600, description: 'Cache TTL in seconds' },
]);
```

## Import Options

```typescript
// Main import
import { ConfigModule, ConfigService, createConfigKey } from '@pixel-brewery/archipel-platform-configuration';

// File-based strategy (tree-shakable sub-export)
import { FileConfigStrategy } from '@pixel-brewery/archipel-platform-configuration/file';
```

## Error Handling

| Error Class              | When Thrown                            |
| ------------------------ | -------------------------------------- |
| `ConfigKeyNotFoundError` | Requested config key is not registered |

## Peer Dependencies

| Package          | Required | Notes                       |
| ---------------- | -------- | --------------------------- |
| `@nestjs/common` | Yes      | NestJS core                 |
| `dotenv`         | Yes      | `.env` file parsing support |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-configuration/index.md`](../../.docs/packages/platform-configuration/index.md)

## Development

```bash
# Build
yarn nx build platform-configuration

# Test
yarn nx test platform-configuration

# Lint
yarn nx lint platform-configuration
```
