---
title: 'Interface: IFeatureFlagEvaluation'
generated: true
editUrl: false
---

# Interface: IFeatureFlagEvaluation

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts#L6)

Result of evaluating a single feature flag.

## Properties

### enabled

```ts
readonly enabled: boolean;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts#L11)

Whether the feature flag is currently enabled.

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts#L8)

The unique key identifying the feature flag.

---

### variant?

```ts
readonly variant?: unknown;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagEvaluation.ts#L14)

Optional variant value for multivariate flags / A/B testing.
