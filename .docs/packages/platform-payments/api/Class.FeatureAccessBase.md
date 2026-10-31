---
title: 'Abstract Class: FeatureAccessBase'
generated: true
editUrl: false
---

# Abstract Class: FeatureAccessBase

Defined in: [libs/platform-payments/src/abstracts/FeatureAccessBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/FeatureAccessBase.ts#L11)

Abstract base for checking and recording feature usage.
Consuming projects must provide a concrete implementation (e.g. backed by Prisma
with subscription + usage tables) and register it via `PaymentModule.register()`.

## Constructors

### Constructor

```ts
new FeatureAccessBase(): FeatureAccessBase;
```

#### Returns

`FeatureAccessBase`

## Methods

### checkAccess()

```ts
abstract checkAccess(
   userId,
   featureKey,
   context?,
   requestedAmount?
): Promise<IFeatureAccessResult>;
```

Defined in: [libs/platform-payments/src/abstracts/FeatureAccessBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/FeatureAccessBase.ts#L39)

Checks whether a user is allowed to use the specified feature
without incrementing usage.

#### Parameters

| Parameter          | Type                                                       | Description                                                |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `userId`           | `string`                                                   | The user identifier.                                       |
| `featureKey`       | `string`                                                   | The feature key to check.                                  |
| `context?`         | [`IFeatureAccessContext`](Interface.IFeatureAccessContext) | Request-scoped access context resolved by the guard.       |
| `requestedAmount?` | `number`                                                   | Units the caller intends to consume. Defaults to one unit. |

#### Returns

`Promise`\<[`IFeatureAccessResult`](Interface.IFeatureAccessResult)\>

The access check result including quota information.

#### Remarks

`requestedAmount` exists because not every allowance is counted in equal units. A storage
allowance is measured in bytes, so "may I use one more" cannot answer whether a specific file
still fits. Implementations that ignore the parameter keep their previous behaviour.

---

### isStockFeature()

```ts
isStockFeature(featureKey): boolean;
```

Defined in: [libs/platform-payments/src/abstracts/FeatureAccessBase.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/FeatureAccessBase.ts#L66)

Declares whether a feature key describes a stock of existing resources rather than
consumption over a period.

A stock allowance must never be metered: a period counter rises when a resource is created,
does not fall when it is removed, and therefore ends up limiting write operations instead of
the resources that exist. Returning `true` here keeps the usage interceptor from booking the
key, so the implementation can derive its value from the records that actually exist.

Defaults to `false`, which preserves the previous behaviour for every existing key.

#### Parameters

| Parameter    | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| `featureKey` | `string` | The feature key to classify. |

#### Returns

`boolean`

---

### recordUsage()

```ts
abstract recordUsage(
   userId,
   featureKey,
   context?,
   amount?
): Promise<void>;
```

Defined in: [libs/platform-payments/src/abstracts/FeatureAccessBase.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/abstracts/FeatureAccessBase.ts#L50)

Records feature usage. Implementations should throw if the quota has been exceeded.

#### Parameters

| Parameter    | Type                                                       | Description                                                |
| ------------ | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `userId`     | `string`                                                   | The user identifier.                                       |
| `featureKey` | `string`                                                   | The feature key to record usage for.                       |
| `context?`   | [`IFeatureAccessContext`](Interface.IFeatureAccessContext) | Request-scoped access context resolved by the interceptor. |
| `amount?`    | `number`                                                   | Units to record. Defaults to one unit.                     |

#### Returns

`Promise`\<`void`\>
