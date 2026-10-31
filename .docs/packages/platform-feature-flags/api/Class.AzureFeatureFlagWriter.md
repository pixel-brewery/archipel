---
title: 'Class: AzureFeatureFlagWriter'
generated: true
editUrl: false
---

# Class: AzureFeatureFlagWriter

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L22)

Azure App Configuration implementation of the [FeatureFlagWriterBase](Class.FeatureFlagWriterBase).
Uses `@azure/app-configuration` (`AppConfigurationClient`) for CRUD operations
on feature flags stored in Azure App Configuration.

## Extends

- [`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase)

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new AzureFeatureFlagWriter(configService): AzureFeatureFlagWriter;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L33)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`AzureFeatureFlagWriter`

#### Overrides

[`FeatureFlagWriterBase`](Class.FeatureFlagWriterBase).[`constructor`](Class.FeatureFlagWriterBase#constructor)

## Methods

### createFlag()

```ts
createFlag(definition): Promise<void>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:141](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L141)

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

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:209](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L209)

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

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L72)

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

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L106)

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

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L47)

Initializes the Azure App Configuration management client.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### ping()

```ts
ping(): Promise<boolean>;
```

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:228](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L228)

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

Defined in: [libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts:168](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-feature-flags/src/azure/AzureFeatureFlagWriter.ts#L168)

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
