---
title: 'Abstract Class: PaymentClientBase'
generated: true
editUrl: false
---

# Abstract Class: PaymentClientBase

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L13)

Abstract base for payment provider clients.
Each provider (Stripe, Paddle, LemonSqueezy, Mollie) must implement this contract
so that the consuming application can switch providers without changing business logic.

## Extended by

- [`StripeClient`](Class.StripeClient)
- [`PaddleClient`](Class.PaddleClient)
- [`LemonSqueezyClient`](Class.LemonSqueezyClient)
- [`MollieClient`](Class.MollieClient)

## Constructors

### Constructor

```ts
new PaymentClientBase(): PaymentClientBase;
```

#### Returns

`PaymentClientBase`

## Methods

### constructWebhookEvent()

```ts
abstract constructWebhookEvent(payload, signature):
  | INormalizedWebhookEvent
| Promise<INormalizedWebhookEvent>;
```

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L63)

Construct and normalize a webhook event from raw payload.

#### Parameters

| Parameter   | Type                                      | Description               |
| ----------- | ----------------------------------------- | ------------------------- |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.         |
| `signature` | `string`                                  | Webhook signature header. |

#### Returns

\| [`INormalizedWebhookEvent`](Interface.INormalizedWebhookEvent)
\| `Promise`\<[`INormalizedWebhookEvent`](Interface.INormalizedWebhookEvent)\>

Normalized webhook event.

---

### createCheckoutSession()

```ts
abstract createCheckoutSession(
   priceId,
   successUrl,
   cancelUrl,
   userId?
): Promise<INormalizedCheckoutSession>;
```

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L44)

Create a checkout session.

#### Parameters

| Parameter    | Type     | Description              |
| ------------ | -------- | ------------------------ |
| `priceId`    | `string` | Price identifier.        |
| `successUrl` | `string` | Success redirect URL.    |
| `cancelUrl`  | `string` | Cancel redirect URL.     |
| `userId?`    | `string` | Optional user reference. |

#### Returns

`Promise`\<[`INormalizedCheckoutSession`](Interface.INormalizedCheckoutSession)\>

Normalized checkout session.

---

### fetchPrices()

```ts
abstract fetchPrices(productId): Promise<INormalizedPrice[]>;
```

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L32)

Fetch all active prices for a product.

#### Parameters

| Parameter   | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `productId` | `string` | External product identifier. |

#### Returns

`Promise`\<[`INormalizedPrice`](Interface.INormalizedPrice)[]\>

Array of normalized prices.

---

### fetchSubscription()

```ts
abstract fetchSubscription(subscriptionId): Promise<
  | INormalizedSubscription
| null>;
```

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L53)

Retrieve subscription details.

#### Parameters

| Parameter        | Type     | Description              |
| ---------------- | -------- | ------------------------ |
| `subscriptionId` | `string` | Subscription identifier. |

#### Returns

`Promise`\<
\| [`INormalizedSubscription`](Interface.INormalizedSubscription)
\| `null`\>

Normalized subscription or `null` if not found.

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-payments/src/abstracts/PaymentClientBase.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/PaymentClientBase.ts#L73)

Lightweight connectivity check for the payment provider.
Override in adapters to perform a real API call (e.g. list products).
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.
