---
title: Payments & Feature Gating
description: Integrate payment providers (Stripe, Paddle, LemonSqueezy, Mollie) and gate features by subscription tier.
order: 9
---

# Payments & Feature Gating

This guide covers payment integration with `platform-payments`: choosing a payment provider, handling webhooks, gating features by subscription tier, and tracking feature usage.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-payments
```

---

## Choose a Payment Provider

`platform-payments` normalizes payment operations across multiple providers. You implement the `PaymentClientBase` for your chosen provider:

| Provider         | What it provides                        |
| ---------------- | --------------------------------------- |
| **Stripe**       | Cards, subscriptions, invoices          |
| **Paddle**       | SaaS billing, tax handling              |
| **LemonSqueezy** | Digital products, memberships           |
| **Mollie**       | European payment methods, subscriptions |

The Stripe adapter requires `stripe >=23.0.0`. It uses
`allowed_payment_method_types` to allow cards and PayPal; Stripe automatically
filters out payment methods that are incompatible with the checkout session.
See the [Stripe API migration notes](https://docs.stripe.com/changelog/endive/2026-09-30/remove-payment-method-types-checkout-sessions).

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { PaymentModule } from '@pixel-brewery/archipel-platform-payments';
import { StripeClient, STRIPE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-payments/stripe';
import { PrismaFeatureAccessAdapter } from './adapters/PrismaFeatureAccessAdapter.js';

@Module({
    imports: [
        PaymentModule.register({
            paymentClient: StripeClient,
            featureAccess: PrismaFeatureAccessAdapter,
            configEntries: STRIPE_CONFIG_ENTRIES,
        }),
    ],
})
export class AppModule {}
```

---

## Using the Payment Client Abstract Base

The built-in provider clients implement `PaymentClientBase`. Inject the abstract base in application services so checkout and webhook code stays provider-agnostic:

```typescript
import { Injectable } from '@nestjs/common';
import { PaymentClientBase, type INormalizedCheckoutSession, type INormalizedSubscription } from '@pixel-brewery/archipel-platform-payments';

@Injectable()
export class CheckoutService {
    private readonly _paymentClient: PaymentClientBase;

    public constructor(paymentClient: PaymentClientBase) {
        this._paymentClient = paymentClient;
    }

    public async createCheckout(priceId: string, userId: string): Promise<INormalizedCheckoutSession> {
        return this._paymentClient.createCheckoutSession(priceId, 'https://app.example.com/billing/success', 'https://app.example.com/billing/cancel', userId);
    }

    public async getSubscription(subscriptionId: string): Promise<INormalizedSubscription | null> {
        return this._paymentClient.fetchSubscription(subscriptionId);
    }
}
```

The library uses **normalized models** (`INormalizedSubscription`, `INormalizedCheckoutSession`, `INormalizedWebhookEvent`) so your application code works identically regardless of the payment provider.

---

## Feature Gating

The `FeatureAccessBase` lets you restrict functionality based on subscription tiers.

### Step 1: Implement the Abstract Base

```typescript
import { Injectable } from '@nestjs/common';
import { FeatureAccessBase, type IFeatureAccessContext, type IFeatureAccessResult } from '@pixel-brewery/archipel-platform-payments';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaFeatureAccessAdapter extends FeatureAccessBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async checkAccess(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<IFeatureAccessResult> {
        const subscription = await this._prisma.subscription.findFirst({
            where: { userId, tenantId: context?.tenantId, status: 'active' },
            include: { plan: { include: { features: true } } },
        });

        const feature = subscription?.plan.features.find((planFeature) => planFeature.key === featureKey);
        if (!feature) {
            return { allowed: false, used: 0, limit: 0, remaining: 0, resetAt: new Date() };
        }

        const used = await this._prisma.featureUsage.count({
            where: {
                userId,
                tenantId: context?.tenantId,
                featureKey,
                usedAt: { gte: subscription.currentPeriodStart },
            },
        });

        const limit = feature.limit;
        const remaining = limit === -1 ? -1 : Math.max(0, limit - used);

        return {
            allowed: limit === -1 || used < limit,
            used,
            limit,
            remaining,
            resetAt: subscription.currentPeriodEnd,
        };
    }

    public async recordUsage(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<void> {
        const access = await this.checkAccess(userId, featureKey, context);
        if (!access.allowed) {
            throw new Error(`Feature quota exceeded for ${featureKey}`);
        }

        await this._prisma.featureUsage.create({
            data: { userId, tenantId: context?.tenantId, featureKey, usedAt: new Date() },
        });
    }
}
```

`FeatureGuard` and `FeatureUsageInterceptor` pass `IFeatureAccessContext` into this adapter. The context includes the resolved `userId`, an optional `tenantId` from `request.user.tenantId`, and the original authenticated subject.

### Step 2: Use the Feature Guard

Use `@RequiresFeature()` to mark endpoints and `FeatureGuard` to enforce access checks:

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@pixel-brewery/archipel-platform-authentication';
import { FeatureGuard, RequiresFeature } from '@pixel-brewery/archipel-platform-payments';

@Controller('exports')
@UseGuards(JwtAuthGuard, FeatureGuard)
export class ExportController {
    @Post('pdf')
    @RequiresFeature('export:pdf')
    public async exportPdf(): Promise<void> {
        // Only accessible to users with 'export:pdf' feature
    }

    @Post('csv')
    @RequiresFeature('export:csv')
    public async exportCsv(): Promise<void> {
        // Only accessible to users with 'export:csv' feature
    }
}
```

### Step 3: Track Usage with Interceptor

`FeatureUsageInterceptor` automatically records feature usage after a successful request:

```typescript
import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '@pixel-brewery/archipel-platform-authentication';
import { FeatureGuard, FeatureUsageInterceptor, RequiresFeature } from '@pixel-brewery/archipel-platform-payments';

@Controller('ai')
@UseGuards(JwtAuthGuard, FeatureGuard)
@UseInterceptors(FeatureUsageInterceptor)
export class AiController {
    @Post('generate')
    @RequiresFeature('ai:generate')
    public async generate(): Promise<string> {
        // Usage is recorded automatically after success
        return 'generated content';
    }
}
```

### Stock Allowances

Some allowances describe **how many resources exist**, not how much was consumed over a period — the number of configured webhook endpoints, for example, or seats in use.

A period counter is wrong for those. It rises when a resource is created, never falls when one is removed, and therefore ends up limiting write operations instead of the resources that exist. A tenant with three of five endpoints who corrected a URL twice would be locked out.

Declare such keys and derive their value from the records that actually exist:

```typescript
public override isStockFeature(featureKey: string): boolean {
    return featureKey === 'webhooks' || featureKey === 'seats';
}

public override async checkAccess(userId: string, featureKey: string, context?: IFeatureAccessContext): Promise<IFeatureAccessResult> {
    if (featureKey === 'webhooks') {
        const used = await this.countWebhookEndpoints(context?.tenantId);
        // ...compare against the plan allowance
    }
    // ...
}
```

`FeatureUsageInterceptor` skips booking for a declared stock key, so the count stays truthful without bypassing the interceptor.

### Allowances Measured in Uneven Units

Not every allowance counts equal units. A storage allowance is measured in bytes, so "may I use one more" cannot answer whether a specific file still fits. Pass the amount:

```typescript
const access = await this._featureAccess.checkAccess(userId, 'storage', context, file.size);

if (!access.allowed) {
    throw new StorageAllowanceExceededError(access.remaining);
}

await this._blobService.uploadObject({ key, body: file.buffer, contentType: file.contentType });
await this._featureAccess.recordUsage(userId, 'storage', context, file.size);
```

Both parameters default to one unit, so an implementation written against the earlier contract keeps working unchanged.

---

## Handling Webhooks

Payment providers send webhook events for subscription changes, payment failures, etc. Create a dedicated webhook controller:

```typescript
import { Controller, Post, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { PaymentClientBase } from '@pixel-brewery/archipel-platform-payments';
import { Request } from 'express';

@Controller('webhooks/payments')
export class PaymentWebhookController {
    private readonly _paymentClient: PaymentClientBase;

    constructor(paymentClient: PaymentClientBase) {
        this._paymentClient = paymentClient;
    }

    @Post()
    public async handleWebhook(@Req() request: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string): Promise<void> {
        const event = await this._paymentClient.constructWebhookEvent(request.rawBody!, signature);

        switch (event.type) {
            case 'subscription.updated':
                // Update subscription in your database
                break;
            case 'subscription.deleted':
                // Handle cancellation
                break;
            case 'invoice.payment_failed':
                // Notify user, retry logic
                break;
        }
    }
}
```

---

## Best Practices

1. **Define feature keys as constants.** Never use inline strings for feature identifiers.
2. **Verify webhook signatures.** Always validate the webhook payload before processing.
3. **Use normalized models.** Don't leak provider-specific types into your business logic.
4. **Implement idempotent webhook handlers.** Webhooks can be delivered multiple times.
5. **Use access context for tenancy.** Read `context.tenantId` instead of coupling controllers to billing tables.
6. **Separate feature gating from billing logic.** The `FeatureAccessBase` should check access and record metered usage, not manage subscriptions.

## Error Handling

Payment client methods such as `fetchPrices`, `createCheckoutSession`, and `fetchSubscription` **propagate errors** to the caller. They do not silently return empty results. Wrap calls in `try/catch` if you need fallback behavior:

```typescript
try {
    const prices = await this._paymentClient.fetchPrices(productId);
    return prices;
} catch (error) {
    this._logger.error('Failed to fetch prices', { productId, error: (error as Error).message });
    return []; // Fallback to empty list
}
```

All client implementations log errors with structured metadata before re-throwing.

All payment clients throw `PaymentError` — a domain error that wraps the underlying SDK error:

```typescript
import { PaymentError } from '@pixel-brewery/archipel-platform-payments';

try {
    await this._paymentClient.createCheckoutSession(priceId, successUrl, cancelUrl, userId);
} catch (error) {
    if (error instanceof PaymentError) {
        // error.provider → 'stripe', 'paddle', 'mollie', 'lemonsqueezy'
        // error.code     → 'PAYMENT'
        // error.cause    → Original provider SDK error
    }
}
```

Map `PaymentError` to an HTTP response in your global exception filter. The `provider` property enables provider-specific alerting.

---

## Next Steps

- See the [Authentication & Authorization](/guides/authentication-and-authorization) guide for securing payment endpoints
- Browse the [platform-payments API reference](/packages/platform-payments/api/) for complete method signatures
