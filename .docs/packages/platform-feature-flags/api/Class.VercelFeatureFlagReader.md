---
title: 'Class: VercelFeatureFlagReader'
generated: true
editUrl: false
---

# Class: VercelFeatureFlagReader

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L41)

Vercel Edge Config implementation of the [FeatureFlagReaderBase](Class.FeatureFlagReaderBase).
Uses `@vercel/edge-config` for reading feature flag state from a Vercel Edge Config store.

Feature flags are expected to be stored as a single object in Edge Config
under the configured prefix key (default: `featureFlags`). The object maps
flag keys to their values (boolean for simple on/off, or any value for variants).

## Example

Edge Config structure:

```json
{
    "featureFlags": {
        "new-checkout-flow": true,
        "pricing-tier": "enterprise",
        "max-upload-size": 100
    }
}
```

## Extends

- [`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase)

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new VercelFeatureFlagReader(configService): VercelFeatureFlagReader;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L53)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`VercelFeatureFlagReader`

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`constructor`](Class.FeatureFlagReaderBase#constructor)

## Methods

### getAllFlags()

```ts
getAllFlags(_context?): Promise<readonly IFeatureFlagEvaluation[]>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:130](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L130)

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

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:109](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L109)

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

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L88)

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

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L67)

Initializes the Vercel Edge Config client.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:160](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L160)

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

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts:154](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagReader.ts#L154)

Refreshes the flag state from the remote provider.
Implementations should reload configuration from the upstream source.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`FeatureFlagReaderBase`](Class.FeatureFlagReaderBase).[`refresh`](Class.FeatureFlagReaderBase#refresh)
