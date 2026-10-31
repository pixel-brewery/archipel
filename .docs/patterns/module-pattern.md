---
title: Dynamic Module Pattern
description: NestJS dynamic modules with register(), abstract base/adapter dependency inversion, and ConfigModule integration.
order: 6
---

# Archipel Dynamic Module Pattern

## Overview

Archipel platform libraries use **NestJS dynamic modules** with a `register()` factory
method and **abstract base/adapter dependency inversion**. Each library defines abstract base
classes. The consuming application provides concrete implementations at registration time.

This pattern keeps platform libraries free of product-specific logic while allowing
full customization through dependency injection.

## Pattern Structure

### 1. Abstract Base (Contract)

```typescript
// abstracts/FeatureAccessBase.ts

export abstract class FeatureAccessBase {
    public abstract checkAccess(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<IFeatureAccessResult>;

    public abstract recordUsage(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<void>;
}
```

Abstract bases are **abstract classes** (not interfaces) so they can serve as NestJS injection tokens.

### 2. Options Interface

```typescript
// interfaces/IPaymentModuleOptions.ts

export interface IPaymentModuleOptions {
    /**
     * Concrete implementation of the FeatureAccessBase.
     */
    featureAccess?: Type<FeatureAccessBase>;

    /**
     * When true the module is registered globally.
     */
    isGlobal?: boolean;
}
```

### 3. Dynamic Module with register()

```typescript
// PaymentModule.ts
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, Module, type Provider, type Type } from '@nestjs/common';

@Module({})
export class PaymentModule {
    public static register(options?: IPaymentModuleOptions): DynamicModule {
        const providers: Provider[] = [StripeClient, FeatureGuard, FeatureUsageInterceptor];

        if (options?.featureAccess) {
            providers.push({
                provide: FeatureAccessBase,
                useClass: options.featureAccess,
            });
        }

        return {
            global: options?.isGlobal ?? false,
            module: PaymentModule,
            imports: [ConfigModule.register('platform-payments', PLATFORM_PAYMENTS_CONFIG_ENTRIES)],
            providers: providers,
            exports: [StripeClient, FeatureGuard, FeatureUsageInterceptor],
        };
    }
}
```

### 4. Consumer Registration

```typescript
// In the consuming application:
@Module({
    imports: [
        PaymentModule.register({
            featureAccess: MyFeatureAccessAdapter,
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
```

## Variants in the Codebase

### Simple: PaymentModule

- 1 optional abstract base (`featureAccess`)
- Optional `isGlobal` flag
- Config via `ConfigModule.register()`

### Complex: AuthModule

- 4 required abstract bases (`authSubject`, `mfaSubject`, `sessionPersistence`, `verificationSubject`)
- 2 optional abstract bases (`socialAuth`, `tokenEnricher`)
- Conditional strategy registration (social OAuth only when `socialAuth` provided)
- Imports: PassportModule, JwtModule, MappingModule, EventModule, IdentifierModule
- Middleware configuration via `configure(consumer)`

### Provider-based: BlobModule

- Uses `forRoot()` instead of `register()` (global by default)
- Discriminated union for provider selection: `{ kind: 'Vercel' }` or `{ kind: 'Custom', useClass: ... }`
- Optional persistence abstract bases (`objectPersistence`, `variantPersistence`)

### Infrastructure: DatabaseModule

- Both `forRoot()` (global) and `register()` (scoped) variants
- Factory provider for PrismaService with extensions
- Health indicator bootstrapping

### Async: McpModule

- `register(options)` for synchronous configuration
- `registerAsync({ useFactory, inject })` for async (e.g., reading config at runtime)
- `registerAsync({ useClass })` for factory class pattern
- `registerAsync({ useExisting })` for reusing an existing factory

## ConfigModule Integration

Every library module imports `ConfigModule.register()` to declare its configuration
dependencies:

```typescript
imports: [ConfigModule.register('platform-payments', PLATFORM_PAYMENTS_CONFIG_ENTRIES)];
```

This registers typed config keys into the global `ConfigRegistry` for validation
and discovery.

## MappingModule Integration

Modules that need object mapping import `MappingModule.withProfiles()`:

```typescript
imports: [MappingModule.withProfiles([SessionMappingProfile])];
```

## Health Indicator Pattern

Infrastructure modules (Database, Blob) register health indicators:

```typescript
providers: [
    BlobHealthIndicator,
    {
        provide: 'BLOB_HEALTH_INDICATOR_BOOTSTRAP',
        useFactory: (orchestrator: HealthOrchestrator, indicator: BlobHealthIndicator) => {
            orchestrator.registerIndicator(indicator);
            return true;
        },
        inject: [HealthOrchestrator, BlobHealthIndicator],
    },
];
```

## Rules

1. **Abstract bases are abstract classes** — not interfaces — so they work as DI tokens.
2. **`register()` for stateless config**, `registerAsync()` when config depends on runtime values.
3. **`forRoot()` for global singletons** (database, blob storage), `register()` for scoped modules.
4. **Always import ConfigModule.register()** to declare environment dependencies.
5. **Optional abstract bases use conditional provider registration** (`if (options?.featureAccess)`).
6. **Required abstract bases are listed in the options interface** without optional markers.
7. **Exports should list concrete services, guards, interceptors** — not internal implementation details.
