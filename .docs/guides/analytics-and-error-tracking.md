---
title: Analytics & Error Tracking
description: Capture errors, messages, and user context with Sentry, Application Insights, Datadog, or a custom provider.
order: 14
---

# Analytics & Error Tracking

This guide covers error tracking and analytics with `platform-analytics`: choosing a provider, capturing exceptions, recording breadcrumbs, and setting user context.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-analytics
```

---

## Choose a Provider

`platform-analytics` abstracts error tracking and analytics behind an `AnalyticsClientBase`. Supported providers:

| Provider                 | When to use                                  |
| ------------------------ | -------------------------------------------- |
| **Sentry**               | Full-featured error tracking and performance |
| **Application Insights** | Azure-native monitoring                      |
| **Datadog**              | Infrastructure + APM monitoring              |
| **Noop**                 | Development / testing — discards all events  |

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { AnalyticsModule } from '@pixel-brewery/archipel-platform-analytics';
import { SentryAnalyticsClient } from './adapters/SentryAnalyticsClient.js';
import { SENTRY_CONFIG_ENTRIES } from './env.js';

@Module({
    imports: [
        AnalyticsModule.register({
            analyticsClient: SentryAnalyticsClient,
            configEntries: [...SENTRY_CONFIG_ENTRIES],
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
```

---

## Implementing the Client Abstract Base

```typescript
import { Injectable } from '@nestjs/common';
import { AnalyticsClientBase, AnalyticsLevel, type IAnalyticsUser, type IAnalyticsBreadcrumb } from '@pixel-brewery/archipel-platform-analytics';
import * as Sentry from '@sentry/node';

@Injectable()
export class SentryAnalyticsClient extends AnalyticsClientBase {
    public captureException(error: Error, context?: Record<string, unknown>): void {
        Sentry.captureException(error, { extra: context });
    }

    public captureMessage(message: string, level: AnalyticsLevel): void {
        Sentry.captureMessage(message, level);
    }

    public setUser(user: IAnalyticsUser): void {
        Sentry.setUser({ id: user.id, email: user.email });
    }

    public addBreadcrumb(breadcrumb: IAnalyticsBreadcrumb): void {
        Sentry.addBreadcrumb({
            category: breadcrumb.category,
            message: breadcrumb.message,
            level: breadcrumb.level,
            data: breadcrumb.data,
        });
    }
}
```

---

## Capturing Errors

Inject `AnalyticsClientBase` to capture exceptions with full context:

```typescript
import { Injectable } from '@nestjs/common';
import { AnalyticsClientBase } from '@pixel-brewery/archipel-platform-analytics';

@Injectable()
export class PaymentService {
    private readonly _analytics: AnalyticsClientBase;

    constructor(analytics: AnalyticsClientBase) {
        this._analytics = analytics;
    }

    public async processPayment(orderId: string): Promise<void> {
        try {
            // ... payment logic
        } catch (error) {
            this._analytics.captureException(error as Error, {
                orderId,
                action: 'processPayment',
            });
            throw error;
        }
    }
}
```

---

## User Context

Set user context early in the request lifecycle (e.g., via a middleware or interceptor) so all captured events include user information:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsClientBase } from '@pixel-brewery/archipel-platform-analytics';
import type { IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Injectable()
export class AnalyticsUserMiddleware implements NestMiddleware {
    private readonly _analytics: AnalyticsClientBase;

    constructor(analytics: AnalyticsClientBase) {
        this._analytics = analytics;
    }

    public use(req: Request, _res: Response, next: NextFunction): void {
        const user = req.user as IAuthSubject | undefined;

        if (user) {
            this._analytics.setUser({
                id: user.id,
                email: user.email ?? undefined,
            });
        }

        next();
    }
}
```

---

## Breadcrumbs

Breadcrumbs are a trail of events leading up to an error. They help you understand what happened before a crash:

```typescript
this._analytics.addBreadcrumb({
    category: 'payment',
    message: 'Checkout session created',
    level: 'info',
    data: { orderId, provider: 'stripe' },
});
```

---

## Lifecycle

All built-in analytics clients (Sentry, Application Insights, Datadog) implement `OnModuleInit` and `OnModuleDestroy`. SDK initialization happens at module startup, and pending events are flushed with a 5-second timeout on shutdown. No manual cleanup is needed.

---

## Development Tips

- Use the **Noop** provider during local development and testing to avoid sending events to production analytics.
- Set `isGlobal: true` in the module registration so `AnalyticsClientBase` is available everywhere without re-importing.
- Combine with `platform-telemetry` for metrics. Use analytics for error tracking and telemetry for performance monitoring.
- Map domain errors to known categories in your analytics context to group related issues.

---

## Next Steps

- See the [Telemetry & Observability](/guides/telemetry-and-observability) guide for metrics and tracing
- Browse the [platform-analytics API reference](/packages/platform-analytics/api/) for complete method signatures
