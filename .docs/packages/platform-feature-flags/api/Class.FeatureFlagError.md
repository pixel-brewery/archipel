---
title: 'Class: FeatureFlagError'
generated: true
editUrl: false
---

# Class: FeatureFlagError

Defined in: [libs/platform-feature-flags/src/errors/FeatureFlagError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/errors/FeatureFlagError.ts#L6)

Domain error thrown when a feature flag operation fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new FeatureFlagError(
   provider,
   message,
   cause?
): FeatureFlagError;
```

Defined in: [libs/platform-feature-flags/src/errors/FeatureFlagError.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/errors/FeatureFlagError.ts#L16)

#### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `provider` | `string`  |
| `message`  | `string`  |
| `cause?`   | `unknown` |

#### Returns

`FeatureFlagError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "FEATURE_FLAG" = 'FEATURE_FLAG';
```

Defined in: [libs/platform-feature-flags/src/errors/FeatureFlagError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/errors/FeatureFlagError.ts#L9)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-feature-flags/src/errors/FeatureFlagError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/errors/FeatureFlagError.ts#L10)
