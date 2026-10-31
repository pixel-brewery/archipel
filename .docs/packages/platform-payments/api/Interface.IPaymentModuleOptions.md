---
title: 'Interface: IPaymentModuleOptions'
generated: true
editUrl: false
---

# Interface: IPaymentModuleOptions

Defined in: [libs/platform-payments/src/PaymentModule.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L19)

Configuration options for the `PaymentModule`.

## Properties

### configEntries?

```ts
configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-payments/src/PaymentModule.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L29)

Provider-specific configuration entries to register with the config module.

---

### featureAccess?

```ts
featureAccess?: Type<FeatureAccessBase>;
```

Defined in: [libs/platform-payments/src/PaymentModule.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L35)

Concrete implementation of the [FeatureAccessBase](Class.FeatureAccessBase).
Required when using `FeatureGuard` or `FeatureUsageInterceptor`.

---

### isGlobal?

```ts
isGlobal?: boolean;
```

Defined in: [libs/platform-payments/src/PaymentModule.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L40)

When `true` the module is registered globally.

---

### paymentClient

```ts
paymentClient: Type<PaymentClientBase>;
```

Defined in: [libs/platform-payments/src/PaymentModule.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/PaymentModule.ts#L24)

Concrete implementation of the [PaymentClientBase](Class.PaymentClientBase).
For example, `StripeClient`, `PaddleClient`, `LemonSqueezyClient`, or `MollieClient`.
