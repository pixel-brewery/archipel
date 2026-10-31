---
title: 'Class: AzureFeatureFlagReader'
generated: true
editUrl: false
---

# Class: AzureFeatureFlagReader

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L31)

Azure App Configuration implementation of the [FeatureFlagReaderBase](Class.FeatureFlagReaderBase).
Uses `@azure/app-configuration-provider` for connecting to Azure App Configuration
and `@microsoft/feature-management` for evaluating feature flags.

## Extends

- [`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase)

## Implements

- `OnModuleInit`
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new AzureFeatureFlagReader(configService): AzureFeatureFlagReader;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L44)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`AzureFeatureFlagReader`

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`constructor`](Class.FeatureFlagReaderBase#constructor)

## Methods

### getAllFlags()

```ts
getAllFlags(_context?): Promise<readonly IFeatureFlagEvaluation[]>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:158](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L158)

Returns all known feature flags with their current evaluation.

#### Parameters

| Parameter   | Type                                                   | Description                                                 |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `_context?` | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<readonly [`IFeatureFlagEvaluation`](Interface.IFeatureFlagEvaluation)[]\>

Array of evaluated feature flags.

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`getAllFlags`](Class.FeatureFlagReaderBase#getallflags)

---

### getVariant()

```ts
getVariant<T>(
   key,
   defaultValue,
   _context?
): Promise<T>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L137)

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
| `_context?`    | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<`T`\>

The variant value of the feature flag.

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`getVariant`](Class.FeatureFlagReaderBase#getvariant)

---

### isEnabled()

```ts
isEnabled(key, _context?): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L122)

Evaluates whether a feature flag is enabled.

#### Parameters

| Parameter   | Type                                                   | Description                                                 |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `key`       | `string`                                               | The unique key identifying the feature flag.                |
| `_context?` | [`IFeatureFlagContext`](Interface.IFeatureFlagContext) | Optional evaluation context for targeting and segmentation. |

#### Returns

`Promise`\<`boolean`\>

`true` if the feature flag is enabled.

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`isEnabled`](Class.FeatureFlagReaderBase#isenabled)

---

### onModuleDestroy()

```ts
onModuleDestroy(): void;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L114)

Cleans up the refresh interval on module destruction.

#### Returns

`void`

#### Implementation of

`OnModuleDestroy.onModuleDestroy`

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L58)

Initializes the Azure App Configuration connection and feature manager.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:198](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L198)

Lightweight connectivity check for the feature flag provider.
Override in adapters to perform a real API call.
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`ping`](Class.FeatureFlagReaderBase#ping)

---

### refresh()

```ts
refresh(): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts:184](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagReader.ts#L184)

Refreshes the flag state from the remote provider.
Implementations should reload configuration from the upstream source.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`refresh`](Class.FeatureFlagReaderBase#refresh)
