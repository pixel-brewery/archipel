---
title: 'Class: VercelFeatureFlagWriter'
generated: true
editUrl: false
---

# Class: VercelFeatureFlagWriter

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L33)

Vercel Edge Config implementation of the [FeatureFlagWriterBase](Class.FeatureFlagWriterBase).
Uses the Vercel REST API to manage feature flags stored in a Vercel Edge Config store.

## Remarks

The Vercel admin client stores feature flags as a single object under the configured
prefix key (default: `featureFlags`). Each flag key maps to a [IFeatureFlagDefinition](Interface.IFeatureFlagDefinition)
serialized as JSON.

## Extends

- [`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase)

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new VercelFeatureFlagWriter(configService): VercelFeatureFlagWriter;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L47)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`VercelFeatureFlagWriter`

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`constructor`](Class.FeatureFlagWriterBase#constructor)

## Methods

### createFlag()

```ts
createFlag(definition): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:135](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L135)

Creates a new feature flag.

#### Parameters

| Parameter    | Type                                                         | Description                    |
| ------------ | ------------------------------------------------------------ | ------------------------------ |
| `definition` | [`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition) | The flag definition to create. |

#### Returns

`Promise`\<`void`\>

#### Throws

If the flag already exists or creation fails.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`createFlag`](Class.FeatureFlagWriterBase#createflag)

---

### deleteFlag()

```ts
deleteFlag(key): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:200](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L200)

Deletes a feature flag.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `key`     | `string` | The unique key of the flag to delete. |

#### Returns

`Promise`\<`void`\>

#### Throws

If the deletion fails.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`deleteFlag`](Class.FeatureFlagWriterBase#deleteflag)

---

### getFlag()

```ts
getFlag(key): Promise<
  | IFeatureFlagDefinition
| undefined>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L86)

Returns a single feature flag definition by key.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `key`     | `string` | The unique key identifying the feature flag. |

#### Returns

`Promise`\<
\| [`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition)
\| `undefined`\>

The flag definition, or `undefined` if not found.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`getFlag`](Class.FeatureFlagWriterBase#getflag)

---

### listFlags()

```ts
listFlags(): Promise<readonly IFeatureFlagDefinition[]>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L111)

Returns all feature flag definitions managed by the provider.

#### Returns

`Promise`\<readonly [`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition)[]\>

Array of flag definitions.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`listFlags`](Class.FeatureFlagWriterBase#listflags)

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L61)

Initializes the Vercel admin client by reading configuration.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:228](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L228)

Lightweight connectivity check for the writer provider.
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`ping`](Class.FeatureFlagWriterBase#ping)

---

### updateFlag()

```ts
updateFlag(key, updates): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts:163](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/vercel/VercelFeatureFlagWriter.ts#L163)

Updates an existing feature flag.
Only the fields present in the partial definition are updated.

#### Parameters

| Parameter | Type                                                                                         | Description                                   |
| --------- | -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `key`     | `string`                                                                                     | The unique key of the flag to update.         |
| `updates` | `Partial`\<`Omit`\<[`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition), `"key"`\>\> | Partial definition with the fields to update. |

#### Returns

`Promise`\<`void`\>

#### Throws

If the flag does not exist or the update fails.

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`updateFlag`](Class.FeatureFlagWriterBase#updateflag)
