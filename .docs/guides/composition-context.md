---
title: Composition Context
description: Stage-aware, configuration-driven module composition for NestJS applications without direct process.env access.
order: 4
---

# Composition Context

The composition context pattern enables **stage-aware infrastructure module selection** at application startup. Rather than hard-coding provider imports or scattering `process.env` checks throughout your codebase, composition provides a clean abstraction that reads configuration once and determines which modules to import.

This is particularly valuable for:

- **Multi-stage deployments** — Use mock mail in development, real SMTP in production
- **Feature flags** — Toggle entire modules based on configuration
- **Provider switching** — Swap payment providers or blob storage backends per environment
- **Clean architecture** — Keep `main.ts` free of conditional logic

---

## Installation

The composition subpath is part of `platform-bootstrap`:

```bash
yarn add @pixel-brewery/archipel-platform-bootstrap @pixel-brewery/archipel-platform-configuration
```

---

## Core Concepts

### Composition Context

The `ICompositionContext` provides typed access to configuration during module assembly:

```typescript
interface ICompositionContext {
    readonly context: INestApplicationContext;
    readonly config: ConfigService;

    getConfigValue<T>(key: IConfigKey<T>): T;
    tryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T;
    getService<T>(token: Type<T>): T;
    close(): Promise<void>;
}
```

### Composition Resolver

Abstract base class for encapsulating composition decisions:

```typescript
abstract class CompositionResolverBase {
    abstract shouldImportProvider(providerKey: string): boolean;

    protected getConfigValue<T>(key: IConfigKey<T>): T;
    protected tryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T;
    protected compareConfigValue<T>(key: IConfigKey<T>, expected: T): boolean;
}
```

### Composition Import

Type alias for valid NestJS module imports:

```typescript
type CompositionImport = Type<unknown> | DynamicModule | Promise<DynamicModule> | ForwardReference<unknown>;
```

---

## Basic Usage

### Direct Factory Approach

For simple cases, use `createCompositionContext()` directly:

```typescript
import { NestFactory } from '@nestjs/core';
import { createCompositionContext } from '@pixel-brewery/archipel-platform-bootstrap/composition';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const context = await createCompositionContext();

    try {
        const driver = context.tryGetConfigValue({ key: 'MAIL_DRIVER' }, 'log');

        if (driver === 'smtp') {
            // Dynamic import only when needed
            const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
            const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');

            console.log('Using SMTP mail delivery');
        }
    } finally {
        await context.close();
    }

    // Continue with normal NestJS bootstrap
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
```

### Builder Integration

For full integration with `PlatformApplicationBuilder`:

```typescript
import { PlatformApplicationBuilder, useApi, CompositionImport } from '@pixel-brewery/archipel-platform-bootstrap';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const builder = await PlatformApplicationBuilder.createWithComposition<NestExpressApplication>(
        async (context) => {
            const imports: CompositionImport[] = [AppModule];

            // Stage-aware mail provider selection
            const driver = context.tryGetConfigValue({ key: 'MAIL_DRIVER' }, 'empty');
            const stage = context.tryGetConfigValue({ key: 'NODE_ENV' }, 'development');

            if (driver === 'smtp' || stage === 'production') {
                const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
                imports.push(MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy }));
            } else {
                const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                const { EmptyDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/empty');
                imports.push(MailModule.register({ deliveryStrategy: EmptyDeliveryStrategy }));
            }

            return imports;
        },
        {
            appFactory: (module) => NestFactory.create<NestExpressApplication>(module, new ExpressAdapter()),
        },
    );

    await builder.use(useApi({ prefix: 'api' })).listenFromConfig({ fallbackPort: 3000 });
}

void main();
```

---

## Custom Composition Resolver

For complex applications, encapsulate composition logic in a dedicated resolver class:

### 1. Define the Resolver

```typescript
// src/composition/AppCompositionResolver.ts
import { Injectable } from '@nestjs/common';
import { ConfigService, createConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { CompositionResolverBase } from '@pixel-brewery/archipel-platform-bootstrap/composition';

const MAIL_DRIVER = createConfigKey<string>('MAIL_DRIVER');
const NODE_ENV = createConfigKey<string>('NODE_ENV');
const FEATURE_NEW_PAYMENTS = createConfigKey<string>('FEATURE_NEW_PAYMENTS');

@Injectable()
export class AppCompositionResolver extends CompositionResolverBase {
    public constructor(configService: ConfigService) {
        super(configService);
    }

    public shouldImportProvider(providerKey: string): boolean {
        switch (providerKey) {
            case 'smtp-mail':
                return this.shouldUseSmtpMail();
            case 'log-mail':
                return !this.shouldUseSmtpMail();
            case 'stripe-payments':
                return this.shouldUseStripePayments();
            case 'paddle-payments':
                return !this.shouldUseStripePayments();
            default:
                return false;
        }
    }

    public shouldUseSmtpMail(): boolean {
        const driver = this.tryGetConfigValue(MAIL_DRIVER, 'log');
        return driver === 'smtp' || this.isProductionLike();
    }

    public shouldUseStripePayments(): boolean {
        const feature = this.tryGetConfigValue(FEATURE_NEW_PAYMENTS, 'disabled');
        return feature !== 'paddle';
    }

    public isProductionLike(): boolean {
        const stage = this.tryGetConfigValue(NODE_ENV, 'development');
        return stage === 'production' || stage === 'staging';
    }
}
```

### 2. Create a Composition Module

```typescript
// src/composition/AppCompositionModule.ts
import { Module } from '@nestjs/common';
import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { AppCompositionResolver } from './AppCompositionResolver.js';

@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: () => new EnvironmentConfigStrategy(),
        }),
    ],
    providers: [AppCompositionResolver],
    exports: [ConfigModule, AppCompositionResolver],
})
export class AppCompositionModule {}
```

### 3. Use in Bootstrap

```typescript
// src/main.ts
import { PlatformApplicationBuilder, CompositionImport } from '@pixel-brewery/archipel-platform-bootstrap';
import { AppCompositionModule, AppCompositionResolver } from './composition.js';
import { AppModule } from './AppModule.js';

async function main(): Promise<void> {
    const builder = await PlatformApplicationBuilder.createWithComposition(
        async (context) => {
            const resolver = context.getService(AppCompositionResolver);
            const imports: CompositionImport[] = [AppModule];

            // Mail provider
            if (resolver.shouldImportProvider('smtp-mail')) {
                const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
                imports.push(MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy }));
            } else {
                const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                const { EmptyDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/empty');
                imports.push(MailModule.register({ deliveryStrategy: EmptyDeliveryStrategy }));
            }

            // Payment provider
            if (resolver.shouldImportProvider('stripe-payments')) {
                const { PaymentModule } = await import('@pixel-brewery/archipel-platform-payments');
                const { StripeClient } = await import('@pixel-brewery/archipel-platform-payments/stripe');
                imports.push(PaymentModule.register({ paymentClient: StripeClient }));
            } else if (resolver.shouldImportProvider('paddle-payments')) {
                const { PaymentModule } = await import('@pixel-brewery/archipel-platform-payments');
                const { PaddleClient } = await import('@pixel-brewery/archipel-platform-payments/paddle');
                imports.push(PaymentModule.register({ paymentClient: PaddleClient }));
            }

            return imports;
        },
        {
            compositionModule: AppCompositionModule,
        },
    );

    await builder.listenFromConfig({ fallbackPort: 3000 });
}
```

---

## Provider Composer Pattern

For reusable provider composition, define composer functions:

```typescript
// src/composition/composers/composeMailProvider.ts
import type { ICompositionContext } from '@pixel-brewery/archipel-platform-bootstrap/composition';
import type { CompositionImport } from '@pixel-brewery/archipel-platform-bootstrap';
import { AppCompositionResolver } from '../AppCompositionResolver.js';

export async function composeMailProvider(context: ICompositionContext): Promise<CompositionImport | null> {
    const resolver = context.getService(AppCompositionResolver);

    if (resolver.shouldImportProvider('smtp-mail')) {
        const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
        const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
        return MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy });
    }

    if (resolver.shouldImportProvider('empty-mail')) {
        const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
        const { EmptyDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/empty');
        return MailModule.register({ deliveryStrategy: EmptyDeliveryStrategy });
    }

    return null;
}
```

Then compose cleanly in main:

```typescript
const builder = await PlatformApplicationBuilder.createWithComposition(
    async (context) => {
        const imports: CompositionImport[] = [AppModule];

        const mailModule = await composeMailProvider(context);
        if (mailModule) imports.push(mailModule);

        const paymentModule = await composePaymentProvider(context);
        if (paymentModule) imports.push(paymentModule);

        return imports;
    },
    { compositionModule: AppCompositionModule },
);
```

---

## Testing Composition

### Unit Testing a Resolver

```typescript
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { AppCompositionResolver } from './AppCompositionResolver.js';

describe('AppCompositionResolver', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('uses SMTP in production regardless of driver setting', () => {
        const configService = {
            get: vi.fn((key: string) => {
                if (key === 'MAIL_DRIVER') return 'log';
                if (key === 'NODE_ENV') return 'production';
                return undefined;
            }),
            tryGet: vi.fn((key: string, fallback: string) => {
                if (key === 'MAIL_DRIVER') return 'log';
                if (key === 'NODE_ENV') return 'production';
                return fallback;
            }),
        } as unknown as ConfigService;

        const resolver = new AppCompositionResolver(configService);

        expect(resolver.shouldImportProvider('smtp-mail')).toBe(true);
        expect(resolver.shouldImportProvider('log-mail')).toBe(false);
    });
});
```

### Integration Testing with Real Context

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createCompositionContext } from '@pixel-brewery/archipel-platform-bootstrap/composition';
import { AppCompositionModule, AppCompositionResolver } from './composition.js';

describe('Composition Integration', () => {
    let originalEnv: Record<string, string | undefined>;

    beforeEach(() => {
        originalEnv = {
            MAIL_DRIVER: process.env['MAIL_DRIVER'],
            NODE_ENV: process.env['NODE_ENV'],
        };
    });

    afterEach(() => {
        for (const [key, value] of Object.entries(originalEnv)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    it('resolves correct mail provider for production', async () => {
        process.env['NODE_ENV'] = 'production';
        process.env['MAIL_DRIVER'] = 'log';

        const context = await createCompositionContext({
            module: AppCompositionModule,
        });

        try {
            const resolver = context.getService(AppCompositionResolver);
            expect(resolver.shouldImportProvider('smtp-mail')).toBe(true);
        } finally {
            await context.close();
        }
    });
});
```

---

## API Reference

### createCompositionContext

```typescript
function createCompositionContext(options?: ICreateCompositionContextOptions): Promise<ICompositionContext>;
```

| Option          | Type            | Default             | Description                 |
| --------------- | --------------- | ------------------- | --------------------------- |
| `module`        | `Type<unknown>` | `CompositionModule` | Custom composition module   |
| `enableLogging` | `boolean`       | `false`             | Enable NestJS logger output |

### PlatformApplicationBuilder.createWithComposition

```typescript
static async createWithComposition<TApp extends INestApplication>(
  composer: (context: ICompositionContext) => Promise<CompositionImport[]> | CompositionImport[],
  options?: ICreateWithCompositionOptions<TApp>
): Promise<PlatformApplicationBuilder<TApp>>;
```

| Option                     | Type                                       | Default             | Description                        |
| -------------------------- | ------------------------------------------ | ------------------- | ---------------------------------- |
| `compositionModule`        | `Type<unknown>`                            | `CompositionModule` | Custom composition module          |
| `enableCompositionLogging` | `boolean`                                  | `false`             | Enable logging during composition  |
| `nestOptions`              | `NestApplicationOptions`                   | `undefined`         | Options for `NestFactory.create()` |
| `platformOptions`          | `IPlatformApplicationOptions`              | `undefined`         | Options for the builder            |
| `appFactory`               | `(module: DynamicModule) => Promise<TApp>` | `undefined`         | Custom app factory                 |

---

## Best Practices

1. **Keep composition modules minimal** — Only configuration and resolver services. No database, queues, or heavy infrastructure.

2. **Use dynamic imports** — Import provider modules only when needed to reduce bundle size and startup time.

3. **Encapsulate decisions in resolvers** — Don't scatter `process.env` checks. Centralize in a `CompositionResolverBase`.

4. **Test resolvers in isolation** — Unit test the decision logic separately from NestJS bootstrap.

5. **Close the context** — Always call `context.close()` when using `createCompositionContext()` directly.

6. **Prefer `tryGetConfigValue` over `getConfigValue`** — Provide sensible defaults for optional configuration.

---

## See Also

- [Application Bootstrap](./application-bootstrap) — Standard bootstrap pipeline without composition
- [Configuration Management](./configuration) — Typed configuration keys and strategies
- [Implementing Adapters](./implementing-adapters) — abstract bases and adapters pattern for swappable implementations
