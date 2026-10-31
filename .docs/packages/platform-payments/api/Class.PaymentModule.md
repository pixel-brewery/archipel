---
title: 'Class: PaymentModule'
generated: true
editUrl: false
---

# Class: PaymentModule

Defined in: [libs/platform-payments/src/PaymentModule.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L53)

NestJS module providing generic payment infrastructure.
Exposes a configurable payment client, a feature-gating guard, and a usage-tracking interceptor.
The specific payment provider (Stripe, Paddle, LemonSqueezy, Mollie) is selected via the options.

## Constructors

### Constructor

```ts
new PaymentModule(): PaymentModule;
```

#### Returns

`PaymentModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-payments/src/PaymentModule.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L63)

Configures the module with the specified options.

#### Parameters

| Parameter | Type                                                       | Description                       |
| --------- | ---------------------------------------------------------- | --------------------------------- |
| `options` | [`IPaymentModuleOptions`](Interface.IPaymentModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition.
