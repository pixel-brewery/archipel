---
title: 'Interface: IFeatureFlagDefinition'
generated: true
editUrl: false
---

# Interface: IFeatureFlagDefinition

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L6)

Represents a full feature flag definition for admin operations (create / update / read).

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L14)

Optional human-readable description.

---

### enabled

```ts
readonly enabled: boolean;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L11)

Whether the feature flag is currently enabled.

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L8)

Unique key identifying the feature flag.

---

### label?

```ts
readonly label?: string;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L17)

Optional label / environment tag (e.g. `"production"`, `"staging"`).

---

### variant?

```ts
readonly variant?: unknown;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagDefinition.ts#L20)

Optional variant value for multivariate flags.
