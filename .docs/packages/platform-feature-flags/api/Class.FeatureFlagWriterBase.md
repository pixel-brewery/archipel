---
title: 'Abstract Class: FeatureFlagWriterBase'
generated: true
editUrl: false
---

# Abstract Class: FeatureFlagWriterBase

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L15)

Abstract base for feature flag writer operations (CRUD).
Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract
so that the admin UI backend can manage flags without being coupled to a specific provider.

## Remarks

This abstract base is intentionally separated from [FeatureFlagReaderBase](Class.FeatureFlagReaderBase) because
the read path (consumed by application code) and the write path (consumed by admin tooling)
have different deployment contexts, security requirements, and SDK dependencies.

## Extended by

- [`AzureFeatureFlagWriter`](Class.AzureFeatureFlagWriter)
- [`VercelFeatureFlagWriter`](Class.VercelFeatureFlagWriter)

## Constructors

### Constructor

```ts
new FeatureFlagWriterBase(): FeatureFlagWriterBase;
```

#### Returns

`FeatureFlagWriterBase`

## Methods

### createFlag()

```ts
abstract createFlag(definition): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L51)

Creates a new feature flag.

#### Parameters

| Parameter    | Type                                                         | Description                    |
| ------------ | ------------------------------------------------------------ | ------------------------------ |
| `definition` | [`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition) | The flag definition to create. |

#### Returns

`Promise`\<`void`\>

#### Throws

If the flag already exists or creation fails.

---

### deleteFlag()

```ts
abstract deleteFlag(key): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L71)

Deletes a feature flag.

#### Parameters

| Parameter | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| `key`     | `string` | The unique key of the flag to delete. |

#### Returns

`Promise`\<`void`\>

#### Throws

If the deletion fails.

---

### getFlag()

```ts
abstract getFlag(key): Promise<
  | IFeatureFlagDefinition
| undefined>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L34)

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

---

### listFlags()

```ts
abstract listFlags(): Promise<readonly IFeatureFlagDefinition[]>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L42)

Returns all feature flag definitions managed by the provider.

#### Returns

`Promise`\<readonly [`IFeatureFlagDefinition`](Interface.IFeatureFlagDefinition)[]\>

Array of flag definitions.

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L80)

Lightweight connectivity check for the writer provider.
Defaults to `true` if not overridden.

#### Returns

`Promise`\<`boolean`\>

`true` if the provider is reachable.

---

### updateFlag()

```ts
abstract updateFlag(key, updates): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts:62](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/abstracts/FeatureFlagWriterBase.ts#L62)

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
