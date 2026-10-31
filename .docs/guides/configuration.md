---
title: Configuration Management
description: Type-safe, strategy-based configuration for NestJS modules with centralized discovery.
order: 2
---

# Configuration Management

This guide covers the `platform-configuration` package — the type-safe configuration system that all other Archipel packages depend on.

> **Migration Note:** Configuration was extracted from `platform-core` into its own package. Re-exports are still available from `platform-core` for backward compatibility. New code should import directly from `@pixel-brewery/archipel-platform-configuration`.

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-configuration
```

---

## Core Concepts

### 1. Typed Config Keys

Instead of scattering `process.env['SOME_KEY']` across your codebase, you define typed config keys once:

```typescript
import { createConfigKey } from '@pixel-brewery/archipel-platform-configuration';

export const DATABASE_URL = createConfigKey<string>('DATABASE_URL');
export const CACHE_TTL = createConfigKey<number>('CACHE_TTL');
export const FEATURE_ENABLED = createConfigKey<boolean>('FEATURE_ENABLED');
```

Each key carries its expected value type at compile time. The runtime shape is minimal — just a `{ key: string }` object.

### 2. Strategy Pattern

Configuration values are resolved through a strategy. The package ships two strategies:

- **`EnvironmentConfigStrategy`** — reads from `process.env`
- **`FileConfigStrategy`** — reads from a `.env` file via dotenv

You can create custom strategies by extending `ConfigStrategyBase` (e.g. Azure App Configuration, AWS Parameter Store, HashiCorp Vault).

### 3. Central Registry

Every library registers the configuration it depends on. The `ConfigRegistry` collects all entries globally, enabling:

- Startup validation (fail fast on missing required keys)
- Discovery (list every env var the application needs)
- Documentation generation

---

## Bootstrap (Application Root)

Call `ConfigModule.forRoot()` once in your root module to create the global `ConfigService`:

```typescript
import { Module } from '@nestjs/common';
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

### Static Overrides

You can inject compile-time values that override or supplement the strategy:

```typescript
ConfigModule.forRoot({
    strategyFactory: () => new EnvironmentConfigStrategy(),
    statics: {
        APP_VERSION: '2.1.0',
        BUILD_SHA: 'abc123',
    },
});
```

---

## Library Registration

Each library module declares the configuration it depends on via `ConfigModule.register()`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

const SMTP_HOST = createConfigKey<string>('SMTP_HOST');
const SMTP_PORT = createConfigKey<number>('SMTP_PORT');
const SMTP_SECURE = createConfigKey<boolean>('SMTP_SECURE');

export const MAIL_CONFIG_ENTRIES: ReadonlyArray<IConfigRegistryEntry> = [
    { key: SMTP_HOST, module: 'mailing', required: true, description: 'SMTP server hostname' },
    { key: SMTP_PORT, module: 'mailing', required: false, defaultValue: 587, description: 'SMTP port' },
    { key: SMTP_SECURE, module: 'mailing', required: false, defaultValue: true, description: 'Use TLS' },
];

@Module({
    imports: [ConfigModule.register('mailing', MAIL_CONFIG_ENTRIES)],
})
export class MailModule {}
```

This makes the entries visible in the global `ConfigRegistry` for validation and documentation.

---

## Using ConfigService

Inject `ConfigService` anywhere to read configuration values:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';

@Injectable()
export class SmtpClient {
    private readonly _host: string;
    private readonly _port: number;

    constructor(configService: ConfigService) {
        this._host = configService.get<string>('SMTP_HOST'); // throws if missing
        this._port = configService.tryGet<number>('SMTP_PORT', 587); // returns fallback if missing
    }
}
```

The service automatically parses string values into the appropriate types (numbers, booleans, null).

---

## Custom Strategies

Extend `ConfigStrategyBase` for custom configuration sources:

```typescript
import { ConfigStrategyBase } from '@pixel-brewery/archipel-platform-configuration';

export class VaultConfigStrategy extends ConfigStrategyBase {
    private _cache: Map<string, string>;

    public constructor(private readonly _vaultUrl: string) {
        super();
        this._cache = new Map();
    }

    public initialize(): void {
        // Fetch all secrets from Vault at startup
    }

    public resolve<T>(key: string): T {
        const value = this._cache.get(key);
        if (value === undefined) {
            throw new ConfigKeyNotFoundError(key, 'vault');
        }
        return value as T;
    }

    public tryResolve<T>(key: string, fallback: T): T {
        return (this._cache.get(key) as T) ?? fallback;
    }

    public has(key: string): boolean {
        return this._cache.has(key);
    }
}
```

Register it:

```typescript
ConfigModule.forRoot({
    strategyFactory: () => new VaultConfigStrategy('https://vault.example.com'),
});
```

---

## File-Based Configuration

For local development, use `FileConfigStrategy` to load from a `.env` file:

```typescript
import { FileConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';

ConfigModule.forRoot({
    strategyFactory: () => new FileConfigStrategy('.env'),
});
```

The strategy reads and parses the file using dotenv. If the file does not exist, the strategy initializes with an empty config (subsequent `get()` calls will throw `ConfigKeyNotFoundError`).

---

## Discovery & Validation

Use `ConfigRegistry` to inspect all registered configuration at startup:

```typescript
import { ConfigRegistry } from '@pixel-brewery/archipel-platform-configuration';

// List all entries grouped by module
const grouped = ConfigRegistry.getByModule();
for (const [module, entries] of grouped) {
    console.log(`Module: ${module}`);
    for (const entry of entries) {
        console.log(`  ${entry.key.key} — ${entry.required ? 'required' : 'optional'}`);
    }
}
```

This is useful for:

- **Health checks** — verify all required config exists before accepting traffic
- **Documentation** — auto-generate `.env.example` files
- **CI/CD** — validate that deployment configs match what the application expects

---

## Migration from platform-core

If you previously imported configuration from `platform-core`:

```typescript
// Before
import { ConfigModule, ConfigService, createConfigKey } from '@pixel-brewery/archipel-platform-core';

// After
import { ConfigModule, ConfigService, createConfigKey } from '@pixel-brewery/archipel-platform-configuration';
```

Re-exports from `platform-core` continue to work for backward compatibility, but new code should use the dedicated package.
