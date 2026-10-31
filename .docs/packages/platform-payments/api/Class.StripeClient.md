---
title: 'Class: StripeClient'
generated: true
editUrl: false
---

# Class: StripeClient

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L24)

Stripe implementation of the [PaymentClientBase](Class.PaymentClientBase).
All Stripe-specific types and logic are encapsulated here.

## Extends

- [`PaymentClientBase`](Class.PaymentClientBase)

## Constructors

### Constructor

```ts
new StripeClient(configService): StripeClient;
```

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L36)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`StripeClient`

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`constructor`](Class.PaymentClientBase#constructor)

## Methods

### constructWebhookEvent()

```ts
constructWebhookEvent(payload, signature): INormalizedWebhookEvent;
```

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:147](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L147)

Construct and normalize a webhook event.

#### Parameters

| Parameter   | Type                                      | Description              |
| ----------- | ----------------------------------------- | ------------------------ |
| `payload`   | `string` \| `Buffer`\<`ArrayBufferLike`\> | Raw webhook body         |
| `signature` | `string`                                  | Webhook signature header |

#### Returns

[`INormalizedWebhookEvent`](Interface.INormalizedWebhookEvent)

Normalized webhook event

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`constructWebhookEvent`](Class.PaymentClientBase#constructwebhookevent)

---

### createCheckoutSession()

```ts
createCheckoutSession(
   priceId,
   successUrl,
   cancelUrl,
   userId?
): Promise<INormalizedCheckoutSession>;
```

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L87)

Create a checkout session.

#### Parameters

| Parameter    | Type     | Description             |
| ------------ | -------- | ----------------------- |
| `priceId`    | `string` | Price identifier        |
| `successUrl` | `string` | Success redirect URL    |
| `cancelUrl`  | `string` | Cancel redirect URL     |
| `userId?`    | `string` | Optional user reference |

#### Returns

`Promise`\<[`INormalizedCheckoutSession`](Interface.INormalizedCheckoutSession)\>

Normalized checkout session

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`createCheckoutSession`](Class.PaymentClientBase#createcheckoutsession)

---

### fetchPrices()

```ts
fetchPrices(productId): Promise<INormalizedPrice[]>;
```

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L58)

Fetch all active prices for a product.

#### Parameters

| Parameter   | Type     | Description                 |
| ----------- | -------- | --------------------------- |
| `productId` | `string` | External product identifier |

#### Returns

`Promise`\<[`INormalizedPrice`](Interface.INormalizedPrice)[]\>

Array of normalized prices

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`fetchPrices`](Class.PaymentClientBase#fetchprices)

---

### fetchSubscription()

```ts
fetchSubscription(subscriptionId): Promise<
  | INormalizedSubscription
| null>;
```

Defined in: [libs/platform-payments/src/stripe/StripeClient.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/stripe/StripeClient.ts#L122)

Retrieve subscription details.

#### Parameters

| Parameter        | Type     | Description             |
| ---------------- | -------- | ----------------------- |
| `subscriptionId` | `string` | Subscription identifier |

#### Returns

`Promise`\<
\| [`INormalizedSubscription`](Interface.INormalizedSubscription)
\| `null`\>

Normalized subscription

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
