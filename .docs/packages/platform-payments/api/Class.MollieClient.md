---
title: 'Class: MollieClient'
generated: true
editUrl: false
---

# Class: MollieClient

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L25)

Mollie implementation of the [PaymentClientBase](Class.PaymentClientBase).
Uses the official `@mollie/api-client` to interact with the Mollie API.

## Extends

- [`PaymentClientBase`](Class.PaymentClientBase)

## Constructors

### Constructor

```ts
new MollieClient(configService): MollieClient;
```

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L37)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MollieClient`

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`constructor`](Class.PaymentClientBase#constructor)

## Methods

### constructWebhookEvent()

```ts
constructWebhookEvent(payload, signature): INormalizedWebhookEvent;
```

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L120)

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
   cancelUrl,
   userId?
): Promise<INormalizedCheckoutSession>;
```

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L65)

Creates a checkout session for Mollie.

#### Parameters

| Parameter    | Type     |
| ------------ | -------- |
| `priceId`    | `string` |
| `successUrl` | `string` |
| `cancelUrl`  | `string` |
| `userId?`    | `string` |

#### Returns

`Promise`\<[`INormalizedCheckoutSession`](Interface.INormalizedCheckoutSession)\>

#### Remarks

Mollie does not have a price catalog, so `priceId` is interpreted as a
formatted monetary amount (e.g. "10.00") for the payment creation.

#### Overrides

[`PaymentClientBase`](Class.PaymentClientBase).[`createCheckoutSession`](Class.PaymentClientBase#createcheckoutsession)

---

### fetchPrices()

```ts
fetchPrices(_productId): Promise<INormalizedPrice[]>;
```

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L51)

Fetch all active prices for a product.

#### Parameters

| Parameter    | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `_productId` | `string` | External product identifier. |

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

Defined in: [libs/platform-payments/src/mollie/MollieClient.ts:94](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/mollie/MollieClient.ts#L94)

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
