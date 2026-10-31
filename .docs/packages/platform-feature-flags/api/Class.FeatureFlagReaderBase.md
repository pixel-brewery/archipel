---
title: 'Abstract Class: FeatureFlagReaderBase'
generated: true
editUrl: false
---

# Abstract Class: FeatureFlagReaderBase

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L11)

Abstract base for feature flag reader operations.
Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract
so that the consuming application can switch providers without changing business logic.

## Extended by

- [`AzureFeatureFlagReader`](Class.AzureFeatureFlagReader)
- [`VercelFeatureFlagReader`](Class.VercelFeatureFlagReader)

## Constructors

### Constructor

```ts
new FeatureFlagReaderBase(): FeatureFlagReaderBase;
```

#### Returns

`FeatureFlagReaderBase`

## Methods

### getAllFlags()

```ts
abstract getAllFlags(context?): Promise<readonly IFeatureFlagEvaluation[]>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L51)

Returns all known feature flags with their current evaluation.

#### Parameters

| Parameter  | Type                                                   | Description                                                 |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `context?` | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<readonly [`IFeatureFlagEvaluation`](Interface.IFeatureFlagEvaluation)[]\>

Array of evaluated feature flags.

---

### getVariant()

```ts
abstract getVariant<T>(
   key,
   defaultValue,
   context?
): Promise<T>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L42)

Returns the variant value of a feature flag for multivariate flags and A/B testing.

#### Type Parameters

| Type Parameter                    | Default type |
| --------------------------------- | ------------ |
| <a id="type-parameter-t"></a> `T` | `unknown`    |

#### Parameters

| Parameter      | Type                                                   | Description                                                 |
| -------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `key`          | `string`                                               | The unique key identifying the feature flag.                |
| `defaultValue` | `T`                                                    | The default value to return if the flag is not found.       |
| `context?`     | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<`T`\>

The variant value of the feature flag.

---

### isEnabled()

```ts
abstract isEnabled(key, context?): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L31)

Evaluates whether a feature flag is enabled.

#### Parameters

| Parameter  | Type                                                   | Description                                                 |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `key`      | `string`                                               | The unique key identifying the feature flag.                |
| `context?` | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<`boolean`\>

`true` if the feature flag is enabled.

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L69)

Lightweight connectivity check for the feature flag provider.
Override in adapters to perform a real API call.
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.

---

### refresh()

```ts
abstract refresh(): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagReaderBase.ts#L59)

Refreshes the flag state from the remote provider.
Implementations should reload configuration from the upstream source.

#### Returns

`Promise`\<`void`\>
