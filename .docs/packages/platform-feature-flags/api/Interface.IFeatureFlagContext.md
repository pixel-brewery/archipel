---
title: 'Interface: IFeatureFlagContext'
generated: true
editUrl: false
---

# Interface: IFeatureFlagContext

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagContext.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagContext.ts#L6)

Context passed to feature flag evaluation for targeting and segmentation.

## Properties

### attributes?

```ts
readonly attributes?: Readonly<Record<string, unknown>>;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagContext.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagContext.ts#L14)

Arbitrary attributes for custom targeting rules.

---

### groups?

```ts
readonly groups?: readonly string[];
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagContext.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagContext.ts#L11)

Groups or segments the user belongs to (e.g. beta testers, enterprise).

---

### userId?

```ts
readonly userId?: string;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagContext.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagContext.ts#L8)

Unique identifier of the current user.
