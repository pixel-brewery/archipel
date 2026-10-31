---
title: 'Class: FeatureGuard'
generated: true
editUrl: false
---

# Class: FeatureGuard

Defined in: [libs/platform-payments/src/guards/FeatureGuard.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/guards/FeatureGuard.ts#L28)

Guard that checks if the user has access to a specific feature
by delegating to the registered [FeatureAccessBase](Class.FeatureAccessBase).

## Implements

- `CanActivate`

## Constructors

### Constructor

```ts
new FeatureGuard(featureAccess, reflector): FeatureGuard;
```

Defined in: [libs/platform-payments/src/guards/FeatureGuard.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/guards/FeatureGuard.ts#L45)

Constructs a new instance of the `FeatureGuard` class.

#### Parameters

| Parameter       | Type                                           | Description                       |
| --------------- | ---------------------------------------------- | --------------------------------- |
| `featureAccess` | [`FeatureAccessBase`](Class.FeatureAccessBase) | The feature access abstract base. |
| `reflector`     | `Reflector`                                    | The NestJS reflector.             |

#### Returns

`FeatureGuard`

## Methods

### canActivate()

```ts
canActivate(context): Promise<boolean>;
```

Defined in: [libs/platform-payments/src/guards/FeatureGuard.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-payments/src/guards/FeatureGuard.ts#L61)

Determines whether the current user has access to the guarded feature.

#### Parameters

| Parameter | Type               | Description            |
| --------- | ------------------ | ---------------------- |
| `context` | `ExecutionContext` | The execution context. |

#### Returns

`Promise`\<`boolean`\>

`true` when the user is allowed to proceed.

#### Implementation of

`CanActivate.canActivate`
