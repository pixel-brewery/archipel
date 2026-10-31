---
title: 'Class: FeatureFlagGuard'
generated: true
editUrl: false
---

# Class: FeatureFlagGuard

Defined in: [libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts#L17)

Guard that checks if a feature flag is enabled before allowing access to a route.
Use the [FeatureFlag](Function.FeatureFlag) decorator to specify which flag to check.

## Implements

- `CanActivate`

## Constructors

### Constructor

```ts
new FeatureFlagGuard(featureFlagReader, reflector): FeatureFlagGuard;
```

Defined in: [libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts#L35)

Constructs a new instance of the `FeatureFlagGuard` class.

#### Parameters

| Parameter           | Type                                                   | Description                            |
| ------------------- | ------------------------------------------------------ | -------------------------------------- |
| `featureFlagReader` | [`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase) | The feature flag reader abstract base. |
| `reflector`         | `Reflector`                                            | The NestJS reflector.                  |

#### Returns

`FeatureFlagGuard`

## Methods

### canActivate()

```ts
canActivate(context): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/guards/FeatureFlagGuard.ts#L51)

Determines whether the guarded feature flag is enabled.

#### Parameters

| Parameter | Type               | Description            |
| --------- | ------------------ | ---------------------- |
| `context` | `ExecutionContext` | The execution context. |

#### Returns

`Promise`\<`boolean`\>

`true` when the feature flag is enabled and access is allowed.

#### Implementation of

`CanActivate.canActivate`
