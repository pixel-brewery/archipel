---
title: '@pixel-brewery/archipel-platform-payments'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-payments

## Classes

| Class                                                    | Description                                                                                                                                                                                                                                                |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [FeatureAccessBase](Class.FeatureAccessBase)             | Abstract base for checking and recording feature usage. Consuming projects must provide a concrete implementation (e.g. backed by Prisma with subscription + usage tables) and register it via `PaymentModule.register()`.                                 |
| [FeatureGuard](Class.FeatureGuard)                       | Guard that checks if the user has access to a specific feature by delegating to the registered [FeatureAccessBase](Class.FeatureAccessBase).                                                                                                               |
| [FeatureUsageInterceptor](Class.FeatureUsageInterceptor) | Interceptor that records feature usage after successful request handling. Delegates recording to the registered [FeatureAccessBase](Class.FeatureAccessBase).                                                                                              |
| [LemonSqueezyClient](Class.LemonSqueezyClient)           | LemonSqueezy implementation of the [PaymentClientBase](Class.PaymentClientBase). Uses the official `@lemonsqueezy/lemonsqueezy.js` SDK.                                                                                                                    |
| [MollieClient](Class.MollieClient)                       | Mollie implementation of the [PaymentClientBase](Class.PaymentClientBase). Uses the official `@mollie/api-client` to interact with the Mollie API.                                                                                                         |
| [PaddleClient](Class.PaddleClient)                       | Paddle implementation of the [PaymentClientBase](Class.PaymentClientBase). Uses the official `@paddle/paddle-node-sdk` to interact with the Paddle Billing API.                                                                                            |
| [PaymentClientBase](Class.PaymentClientBase)             | Abstract base for payment provider clients. Each provider (Stripe, Paddle, LemonSqueezy, Mollie) must implement this contract so that the consuming application can switch providers without changing business logic.                                      |
| [PaymentError](Class.PaymentError)                       | Domain error thrown when a payment operation fails.                                                                                                                                                                                                        |
| [PaymentHealthIndicator](Class.PaymentHealthIndicator)   | Health indicator for the payment infrastructure. Calls [PaymentClientBase.ping](Class.PaymentClientBase#ping) to verify provider connectivity.                                                                                                             |
| [PaymentModule](Class.PaymentModule)                     | NestJS module providing generic payment infrastructure. Exposes a configurable payment client, a feature-gating guard, and a usage-tracking interceptor. The specific payment provider (Stripe, Paddle, LemonSqueezy, Mollie) is selected via the options. |
| [StripeClient](Class.StripeClient)                       | Stripe implementation of the [PaymentClientBase](Class.PaymentClientBase). All Stripe-specific types and logic are encapsulated here.                                                                                                                      |

## Interfaces

| Interface                                                          | Description                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [IFeatureAccessContext](Interface.IFeatureAccessContext)           | Request-scoped context for feature access checks and usage recording. |
| [IFeatureAccessResult](Interface.IFeatureAccessResult)             | Result of a feature access check.                                     |
| [INormalizedCheckoutSession](Interface.INormalizedCheckoutSession) | Normalized checkout session.                                          |
| [INormalizedPrice](Interface.INormalizedPrice)                     | Normalized price information.                                         |
| [INormalizedSubscription](Interface.INormalizedSubscription)       | Normalized subscription.                                              |
| [INormalizedWebhookEvent](Interface.INormalizedWebhookEvent)       | Normalized webhook event.                                             |
| [IPaymentModuleOptions](Interface.IPaymentModuleOptions)           | Configuration options for the `PaymentModule`.                        |

## Type Aliases

| Type Alias                                               | Description                                                                                                                  |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [CheckoutPaymentStatus](TypeAlias.CheckoutPaymentStatus) | Provider-independent checkout payment status values. `unknown` represents a provider status without a normalized equivalent. |
| [InvoiceStatus](TypeAlias.InvoiceStatus)                 | Provider-independent invoice status values. `unknown` represents a provider status without a normalized equivalent.          |
| [SubscriptionStatus](TypeAlias.SubscriptionStatus)       | Provider-independent subscription status values. `unknown` represents a provider status without a normalized equivalent.     |

## Variables

| Variable                                                              | Description                                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [FEATURE\_KEY\_METADATA](Variable.FEATURE_KEY_METADATA)               | -                                                                         |
| [LEMONSQUEEZY\_API\_KEY](Variable.LEMONSQUEEZY_API_KEY)               | LemonSqueezy API key.                                                     |
| [LEMONSQUEEZY\_CONFIG\_ENTRIES](Variable.LEMONSQUEEZY_CONFIG_ENTRIES) | Configuration entries required by the LemonSqueezy payment provider.      |
| [LEMONSQUEEZY\_STORE\_ID](Variable.LEMONSQUEEZY_STORE_ID)             | LemonSqueezy store ID.                                                    |
| [LEMONSQUEEZY\_WEBHOOK\_SECRET](Variable.LEMONSQUEEZY_WEBHOOK_SECRET) | LemonSqueezy webhook signing secret.                                      |
| [MOLLIE\_API\_KEY](Variable.MOLLIE_API_KEY)                           | Mollie API key.                                                           |
| [MOLLIE\_CONFIG\_ENTRIES](Variable.MOLLIE_CONFIG_ENTRIES)             | Configuration entries required by the Mollie payment provider.            |
| [MOLLIE\_WEBHOOK\_SECRET](Variable.MOLLIE_WEBHOOK_SECRET)             | Mollie webhook secret for verifying webhook payloads.                     |
| [PADDLE\_API\_KEY](Variable.PADDLE_API_KEY)                           | Paddle API key.                                                           |
| [PADDLE\_CONFIG\_ENTRIES](Variable.PADDLE_CONFIG_ENTRIES)             | Configuration entries required by the Paddle payment provider.            |
| [PADDLE\_ENVIRONMENT](Variable.PADDLE_ENVIRONMENT)                    | Paddle environment (`production` or `sandbox`). Defaults to `production`. |
| [PADDLE\_WEBHOOK\_SECRET](Variable.PADDLE_WEBHOOK_SECRET)             | Paddle webhook secret key.                                                |
| [STRIPE\_API\_KEY](Variable.STRIPE_API_KEY)                           | Stripe secret API key.                                                    |
| [STRIPE\_CONFIG\_ENTRIES](Variable.STRIPE_CONFIG_ENTRIES)             | Configuration entries required by the Stripe payment provider.            |
| [STRIPE\_WEBHOOK\_SECRET](Variable.STRIPE_WEBHOOK_SECRET)             | Stripe webhook signing secret.                                            |

## Functions

| Function                                    | Description                                                                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [RequiresFeature](Function.RequiresFeature) | Decorator to mark endpoints that require feature access check. The `featureKey` is a free-form string defined by the consuming project. |
