# @pixel-brewery/archipel-platform-payments

Provider-agnostic payment infrastructure for NestJS with support for Stripe, Paddle, LemonSqueezy, and Mollie.

## Features

- **Provider-agnostic** — Switch between Stripe, Paddle, LemonSqueezy, or Mollie without changing business logic
- **Subpath imports** — Each provider lives in its own subpath — install only the SDK you need
- **Normalized types** — All providers return the same `INormalizedPrice`, `INormalizedSubscription`, etc.
- **Feature gating** — `FeatureGuard` + `@RequiresFeature()` for quota- or tenant-plan-based access control
- **Usage tracking** — `FeatureUsageInterceptor` records feature consumption automatically
- **Stock allowances** — `isStockFeature()` marks a key as a count of existing resources so it is never metered by a period counter
- **Sized checks** — `checkAccess()` and `recordUsage()` accept an amount, for allowances whose units differ in size such as bytes of storage
- **Strict error propagation** — Methods like `fetchPrices` propagate errors to the caller instead of silently returning empty results
- **Health checks** — `PaymentHealthIndicator` for readiness probes (separate `/health` subpath)

## ⚠️ Environment Variables

Choose one provider and configure its required variables.

### Stripe

Requires `stripe >=23.0.0`. Checkout sessions allow cards and PayPal through
`allowed_payment_method_types`; Stripe filters out methods that are incompatible
with the session. See the [Stripe API migration notes](https://docs.stripe.com/changelog/endive/2026-09-30/remove-payment-method-types-checkout-sessions).

| Variable                | Required | Default | Description                   |
| ----------------------- | -------- | ------- | ----------------------------- |
| `STRIPE_API_KEY`        | yes      | -       | Stripe secret API key         |
| `STRIPE_WEBHOOK_SECRET` | yes      | -       | Stripe webhook signing secret |

### Paddle

| Variable                | Required | Default      | Description                                    |
| ----------------------- | -------- | ------------ | ---------------------------------------------- |
| `PADDLE_API_KEY`        | yes      | -            | Paddle API key                                 |
| `PADDLE_WEBHOOK_SECRET` | yes      | -            | Paddle webhook secret key                      |
| `PADDLE_ENVIRONMENT`    | no       | `production` | Paddle environment (`production` or `sandbox`) |

### LemonSqueezy

| Variable                      | Required | Default | Description                         |
| ----------------------------- | -------- | ------- | ----------------------------------- |
| `LEMONSQUEEZY_API_KEY`        | yes      | -       | LemonSqueezy API key                |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | yes      | -       | LemonSqueezy webhook signing secret |
| `LEMONSQUEEZY_STORE_ID`       | yes      | -       | LemonSqueezy store ID               |

### Mollie

| Variable                | Required | Default | Description                            |
| ----------------------- | -------- | ------- | -------------------------------------- |
| `MOLLIE_API_KEY`        | yes      | -       | Mollie API key                         |
| `MOLLIE_WEBHOOK_SECRET` | yes      | -       | Mollie webhook secret for verification |

## Quick Start

```typescript
import { PaymentModule } from '@pixel-brewery/archipel-platform-payments';
import { StripeClient, STRIPE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/stripe';

@Module({
    imports: [
        PaymentModule.register({
            paymentClient: StripeClient,
            configEntries: STRIPE_CONFIG_ENTRIES,
        }),
    ],
})
export class AppModule {}
```

## Supported Providers

| Subpath                                                  | Class                | SDK                             |
| -------------------------------------------------------- | -------------------- | ------------------------------- |
| `@pixel-brewery/archipel-platform-payments/stripe`       | `StripeClient`       | `stripe`                        |
| `@pixel-brewery/archipel-platform-payments/paddle`       | `PaddleClient`       | `@paddle/paddle-node-sdk`       |
| `@pixel-brewery/archipel-platform-payments/lemonsqueezy` | `LemonSqueezyClient` | `@lemonsqueezy/lemonsqueezy.js` |
| `@pixel-brewery/archipel-platform-payments/mollie`       | `MollieClient`       | `@mollie/api-client`            |

## Import Options

```typescript
// Main import (module, abstract bases, guards, models)
import {
    FeatureAccessBase,
    PaymentClientBase,
    PaymentModule,
    type IFeatureAccessContext,
    type IFeatureAccessResult,
} from '@pixel-brewery/archipel-platform-payments';

// Provider-specific (tree-shakable sub-exports)
import { StripeClient, STRIPE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/stripe';
import { PaddleClient, PADDLE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/paddle';
import { LemonSqueezyClient, LEMONSQUEEZY_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/lemonsqueezy';
import { MollieClient, MOLLIE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/mollie';

// Health indicator (optional)
import { PaymentHealthIndicator } from '@pixel-brewery/archipel-platform-payments/health';
```

## Abstract Bases

| Abstract Base       | Required | Description                                  |
| ------------------- | -------- | -------------------------------------------- |
| `PaymentClientBase` | Yes      | Payment provider client contract             |
| `FeatureAccessBase` | No       | Feature gating / quota access (app-provided) |

`FeatureGuard` resolves `@RequiresFeature()` metadata from both route handlers and controller classes. `FeatureGuard` and `FeatureUsageInterceptor` pass a request-scoped `IFeatureAccessContext` to `FeatureAccessBase`, so application adapters can evaluate tenant-scoped plans without coupling controllers to billing internals.

```typescript
export class AppFeatureAccessAdapter extends FeatureAccessBase {
    public async checkAccess(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<IFeatureAccessResult> {
        const tenantId = context?.tenantId;
        // Resolve tenant subscription, quota, or plan access here.
        return { allowed: true, used: 0, limit: -1, remaining: -1, resetAt: new Date() };
    }

    public async recordUsage(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<void> {
        const tenantId = context?.tenantId;
        // Persist tenant-scoped usage for the feature here.
    }
}
```

## Error Handling

| Error Class    | Code      | When Thrown                                       |
| -------------- | --------- | ------------------------------------------------- |
| `PaymentError` | `PAYMENT` | Provider SDK failure during any payment operation |

## Peer Dependencies

| Package                                          | Required | Notes                         |
| ------------------------------------------------ | -------- | ----------------------------- |
| `@pixel-brewery/archipel-platform-configuration` | Yes      | Typed config key support      |
| `@nestjs/common`                                 | Yes      | NestJS core                   |
| `stripe`                                         | No       | Required for Stripe provider  |
| `@paddle/paddle-node-sdk`                        | No       | Required for Paddle provider  |
| `@lemonsqueezy/lemonsqueezy.js`                  | No       | Required for LemonSqueezy     |
| `@mollie/api-client`                             | No       | Required for Mollie provider  |
| `@pixel-brewery/archipel-platform-health`        | No       | Required for health indicator |
| `@nestjs/terminus`                               | No       | Required for health indicator |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-payments/index.md`](../../.docs/packages/platform-payments/index.md)

## Development

```bash
# Build
yarn nx build platform-payments

# Test
yarn nx test platform-payments

# Lint
yarn nx lint platform-payments
```
