---
title: 'Class: LemonSqueezyClient'
generated: true
editUrl: false
---

# Class: LemonSqueezyClient

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L25)

LemonSqueezy implementation of the [PaymentClientBase](Class.PaymentClientBase).
Uses the official `@lemonsqueezy/lemonsqueezy.js` SDK.

## Extends

- [`PaymentClientBase`](Class.PaymentClientBase)

## Constructors

### Constructor

```ts
new LemonSqueezyClient(configService): LemonSqueezyClient;
```

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L36)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`LemonSqueezyClient`

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`constructor`](Class.PaymentClientBase#constructor)

## Methods

### constructWebhookEvent()

```ts
constructWebhookEvent(payload, signature): INormalizedWebhookEvent;
```

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L125)

Construct and normalize a webhook event from raw payload.

#### Parameters

| Parameter   | Type                                      | Description               |
| ----------- | ----------------------------------------- | ------------------------- |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body.         |
| `signature` | `string`                                  | Webhook signature header. |

#### Returns

[`INormalizedWebhookEvent`](Interface.INormalizedWebhookEvent)

Normalized webhook event.

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`constructWebhookEvent`](Class.PaymentClientBase#constructwebhookevent)

---

### createCheckoutSession()

```ts
createCheckoutSession(
   priceId,
   successUrl,
   _cancelUrl,
   userId?
): Promise<INormalizedCheckoutSession>;
```

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L72)

Create a checkout session.

#### Parameters

| Parameter    | Type     | Description              |
| ------------ | -------- | ------------------------ |
| `priceId`    | `string` | Price identifier.        |
| `successUrl` | `string` | Success redirect URL.    |
| `_cancelUrl` | `string` | Cancel redirect URL.     |
| `userId?`    | `string` | Optional user reference. |

#### Returns

`Promise`\<[`INormalizedCheckoutSession`](Interface.INormalizedCheckoutSession)\>

Normalized checkout session.

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`createCheckoutSession`](Class.PaymentClientBase#createcheckoutsession)

---

### fetchPrices()

```ts
fetchPrices(productId): Promise<INormalizedPrice[]>;
```

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L52)

Fetch all active prices for a product.

#### Parameters

| Parameter   | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `productId` | `string` | External product identifier. |

#### Returns

`Promise`\<[`INormalizedPrice`](Interface.INormalizedPrice)[]\>

Array of normalized prices.

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`fetchPrices`](Class.PaymentClientBase#fetchprices)

---

### fetchSubscription()

```ts
fetchSubscription(subscriptionId): Promise<
  | INormalizedSubscription
| null>;
```

Defined in: [libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/lemonsqueezy/LemonSqueezyClient.ts#L106)

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

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`fetchSubscription`](Class.PaymentClientBase#fetchsubscription)

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

#### Inherited from

[`PaymentClientBase`](Class.PaymentClientBase).[`ping`](Class.PaymentClientBase#ping)
