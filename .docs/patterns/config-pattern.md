---
title: Configuration Pattern
description: Typed config keys, ConfigRegistry, ConfigService, env.ts conventions, and ConfigModule integration.
order: 1
---

# Archipel Configuration Pattern

## Overview

Archipel uses a **typed configuration key** system with a **central registry**.
Each platform library declares its required and optional config keys in an `env.ts`
file, which are registered into the global `ConfigRegistry`. At runtime, the
`ConfigService` resolves values through a pluggable strategy (environment variables,
Azure App Configuration, etc.).

**Rule:** No direct `process.env` access outside of config strategy implementations.

## Core Types

### `IConfigKey<TType>`

```typescript
export interface IConfigKey<TType = unknown> {
    readonly _type?: TType; // Phantom type for compile-time safety
    readonly key: string; // The actual config key string
}
```

### `createConfigKey<TType>`

```typescript
import { createConfigKey } from '@pixel-brewery/archipel-platform-core';

export const APP_URL = createConfigKey<string>('APP_URL');
export const APP_PORT = createConfigKey<number>('APP_PORT');
export const FEATURE_ENABLED = createConfigKey<boolean>('FEATURE_ENABLED');
```

## ConfigService API

```typescript
@Injectable()
export class ConfigService {
    // Throws if key not found
    public get<T>(key: string): T;

    // Returns fallback if key not found
    public tryGet<T>(key: string, fallback: T): T;

    // Compares a key's value to an expected value
    public compare<T>(key: string, value: T): boolean;
}
```

**Auto-parsing:** String values are automatically converted:

- `'true'` / `'false'` → `boolean`
- Numeric strings → `number`
- Empty strings → `null`

## ConfigRegistry

A static global registry that collects all declared config keys at module initialization.

```typescript
export class ConfigRegistry {
    // Register keys for a module
    public static register(module: string, entries: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>): void;

    // Query all registered entries
    public static getAll(): ReadonlyArray<IConfigRegistryEntry>;
    public static getByModule(): ReadonlyMap<string, ReadonlyArray<IConfigRegistryEntry>>;
    public static getRequired(): ReadonlyArray<IConfigRegistryEntry>;
    public static getModules(): ReadonlyArray<string>;
}
```

### IConfigRegistryEntry

```typescript
export interface IConfigRegistryEntry<TType = unknown> {
    readonly key: IConfigKey<TType>;
    readonly module: string;
    readonly required: boolean;
    readonly defaultValue?: TType;
    readonly description?: string;
}
```

## How to Add Configuration to a Library

### Step 1: Define typed config keys in env.ts

```typescript
// src/env.ts
import { createConfigKey } from '@pixel-brewery/archipel-platform-core';
import { ConfigRegistry, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-core';

// ──────────────────────────────────────────────────────────────
// Keys
// ──────────────────────────────────────────────────────────────

export const STRIPE_SECRET_KEY = createConfigKey<string>('STRIPE_SECRET_KEY');
export const STRIPE_WEBHOOK_SECRET = createConfigKey<string>('STRIPE_WEBHOOK_SECRET');
export const PAYMENT_CURRENCY = createConfigKey<string>('PAYMENT_CURRENCY');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

export const PLATFORM_PAYMENTS_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: STRIPE_SECRET_KEY, required: true, description: 'Stripe API secret key.' },
    { key: STRIPE_WEBHOOK_SECRET, required: true, description: 'Stripe webhook signing secret.' },
    { key: PAYMENT_CURRENCY, required: false, defaultValue: 'EUR', description: 'Default payment currency.' },
];
```

### Step 2: Register in ConfigModule

```typescript
// In the module's register() method:
imports: [ConfigModule.register('platform-payments', PLATFORM_PAYMENTS_CONFIG_ENTRIES)];
```

Or for libraries without a dedicated module (self-registration):

```typescript
// At the bottom of env.ts:
ConfigRegistry.register('platform-payments', PLATFORM_PAYMENTS_CONFIG_ENTRIES);
```

### Step 3: Use in services

```typescript
@Injectable()
export class StripeClient {
    private readonly _configService: ConfigService;

    public constructor(configService: ConfigService) {
        this._configService = configService;
    }

    private getApiKey(): string {
        return this._configService.get<string>('STRIPE_SECRET_KEY');
    }
}
```

## ConfigModule

### register() — Per-library config registration

Declares which config keys a library needs. Used in `imports` of feature modules.

```typescript
ConfigModule.register('platform-authentication', PLATFORM_AUTHENTICATION_CONFIG_ENTRIES);
```

### forRoot() — Application bootstrap

Configures the global strategy and static overrides. Used once in the root module.

```typescript
ConfigModule.forRoot({
    strategyFactory: () => new EnvironmentConfigStrategy(),
    statics: { APP_VERSION: '1.0.0' },
});
```

## ConfigStrategyBase

Pluggable strategy for resolving config values:

```typescript
export abstract class ConfigStrategyBase {
    public abstract initialize(): void;
    public abstract resolve<T>(key: string): T;
    public abstract tryResolve<T>(key: string, fallback: T): T;
    public abstract has(key: string): boolean;
}
```

Implementations can read from environment variables, Azure App Configuration, Consul, etc.

## Existing Config Modules

| Module                  | Prefix                                   | Example Keys                                       |
| ----------------------- | ---------------------------------------- | -------------------------------------------------- |
| platform-core           | APP_, NODE_ENV, INTELLIGENCE_            | APP_URL, APP_PORT, APP_VERSION, INTELLIGENCE_MODEL |
| platform-authentication | AUTH_                                    | AUTH_JWT_SECRET, AUTH_JWT_EXPIRES_IN               |
| platform-payments       | STRIPE_, PADDLE_, LEMONSQUEEZY_, MOLLIE_ | STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET           |
| platform-openapi        | SWAGGER_                                 | SWAGGER_CONTACT_NAME, SWAGGER_CONTACT_URL          |
| platform-caching        | CACHE_, REDIS_                           | CACHE_DEFAULT_TTL_MS, CACHE_MAX_ENTRIES, REDIS_URL |
| platform-logging        | APP_LOG_LEVEL                            | APP_LOG_LEVEL                                      |

## Rules

1. **All config keys defined via `createConfigKey<T>()`** — never raw `process.env` access.
2. **Each library declares entries in `env.ts`** with required flag, default value, and description.
3. **Registration via `ConfigModule.register()`** in the module, or self-registration for libraries without modules.
4. **`ConfigService.get()` throws on missing required keys** — fail-fast at startup.
5. **Use `tryGet()` with fallback** for optional keys.
6. **Config key names use UPPER_SNAKE_CASE** matching environment variable conventions.
7. **Group related keys** with comment separators in env.ts.
