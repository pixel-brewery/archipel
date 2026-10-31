---
title: 'Class: PaymentHealthIndicator'
generated: true
editUrl: false
---

# Class: PaymentHealthIndicator

Defined in: [libs/platform-payments/src/health/PaymentHealthIndicator.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/health/PaymentHealthIndicator.ts#L17)

Health indicator for the payment infrastructure.
Calls [PaymentClientBase.ping](Class.PaymentClientBase#ping) to verify provider connectivity.

## Implements

- `IHealthIndicator`

## Constructors

### Constructor

```ts
new PaymentHealthIndicator(paymentClient?): PaymentHealthIndicator;
```

Defined in: [libs/platform-payments/src/health/PaymentHealthIndicator.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/health/PaymentHealthIndicator.ts#L27)

#### Parameters

| Parameter        | Type                                           |
| ---------------- | ---------------------------------------------- |
| `paymentClient?` | [`PaymentClientBase`](Class.PaymentClientBase) |

#### Returns

`PaymentHealthIndicator`

## Properties

### key

```ts
readonly key: string = 'payment';
```

Defined in: [libs/platform-payments/src/health/PaymentHealthIndicator.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/health/PaymentHealthIndicator.ts#L35)

Unique key identifying the indicator

#### Implementation of

`IHealthIndicator.key`

## Methods

### check()

```ts
check(): Promise<HealthIndicatorResult<string>>;
```

Defined in: [libs/platform-payments/src/health/PaymentHealthIndicator.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/health/PaymentHealthIndicator.ts#L48)

Pings the payment provider to verify connectivity.
Returns disabled status when no client is configured.

#### Returns

`Promise`\<`HealthIndicatorResult`\<`string`\>\>

The health indicator result.

#### Implementation of

`IHealthIndicator.check`
