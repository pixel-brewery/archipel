---
title: 'Interface: IFeatureFlagModuleOptions'
generated: true
editUrl: false
---

# Interface: IFeatureFlagModuleOptions

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts#L15)

Configuration options for the [FeatureFlagModule](Class.FeatureFlagModule).

## Properties

### configEntries?

```ts
readonly configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts#L32)

Provider-specific configuration entries to register with the config module.

---

### featureFlagReader

```ts
readonly featureFlagReader: Type<FeatureFlagReaderBase>;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts#L20)

Concrete implementation of the [FeatureFlagReaderBase](Class.FeatureFlagReaderBase).
For example, `AzureFeatureFlagReader` or `VercelFeatureFlagReader`.

---

### featureFlagWriter?

```ts
readonly featureFlagWriter?: Type<FeatureFlagWriterBase>;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts#L27)

Optional concrete implementation of the [FeatureFlagWriterBase](Class.FeatureFlagWriterBase).
For example, `AzureFeatureFlagWriter` or `VercelFeatureFlagWriter`.
When provided the module will also export the writer abstract base for CRUD operations.

---

### isGlobal?

```ts
readonly isGlobal?: boolean;
```

Defined in: [libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/models/IFeatureFlagModuleOptions.ts#L37)

When `true` the module is registered globally.
