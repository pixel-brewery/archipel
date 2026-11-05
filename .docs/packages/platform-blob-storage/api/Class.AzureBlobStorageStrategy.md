---
title: 'Class: AzureBlobStorageStrategy'
generated: true
editUrl: false
---

# Class: AzureBlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L37)

Provides a blob storage strategy backed by Microsoft Azure Blob Storage.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new AzureBlobStorageStrategy(configService): AzureBlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L58)

Initializes a new instance of the AzureBlobStorageStrategy class.

#### Parameters

| Parameter       | Type            | Description                                             |
| --------------- | --------------- | ------------------------------------------------------- |
| `configService` | `ConfigService` | The configuration service providing environment values. |

#### Returns

`AzureBlobStorageStrategy`

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`constructor`](Class.BlobStorageStrategyBase#constructor)

## Properties

### providerId

```ts
readonly providerId: string = 'azure';
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L81)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L84)

Gets the default bucket (container/directory) configured for the provider.

##### Returns

`string`

Gets the default bucket (container/directory) configured for the provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`defaultBucket`](Class.BlobStorageStrategyBase#defaultbucket)

## Methods

### createSignedUrl()

```ts
createSignedUrl(request): Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:337](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L337)

Creates a signed URL for the specified blob object.
Not all providers support this operation.

#### Parameters

| Parameter | Type                                                       | Description                                |
| --------- | ---------------------------------------------------------- | ------------------------------------------ |
| `request` | [`IBlobSignedUrlRequest`](Interface.IBlobSignedUrlRequest) | The request describing the object to link. |

#### Returns

`Promise`\<`string`\>

The generated signed URL.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`createSignedUrl`](Class.BlobStorageStrategyBase#createsignedurl)

---

### deleteObject()

```ts
deleteObject(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:171](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L171)

Deletes a blob object from the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobDeleteRequest`](Interface.IBlobDeleteRequest) | The delete request describing the object to remove. |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`deleteObject`](Class.BlobStorageStrategyBase#deleteobject)

---

### deleteObjectConditionally()

```ts
deleteObjectConditionally(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:290](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L290)

Deletes the selected object only while its exact observed ETag still matches.

A supplied resource identity must match the actual target before deletion.
Client cancellation does not undo a mutation already accepted by the provider.

#### Parameters

| Parameter | Type                                                                       | Description                                                      |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `request` | [`IBlobConditionalDeleteRequest`](Interface.IBlobConditionalDeleteRequest) | Exact ETag, optional immutable selector and cancellation budget. |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`deleteObjectConditionally`](Class.BlobStorageStrategyBase#deleteobjectconditionally)

---

### downloadObject()

```ts
downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:140](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L140)

Downloads a blob object from the storage backend.

#### Type Parameters

| Type Parameter                            |
| ----------------------------------------- |
| <a id="type-parameter-tdata"></a> `TData` |

#### Parameters

| Parameter | Type                                                     | Description                                             |
| --------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `request` | [`IBlobDownloadRequest`](Interface.IBlobDownloadRequest) | The download request describing the object to download. |

#### Returns

`Promise`\<[`IBlobDownloadResult`](Interface.IBlobDownloadResult)\<`TData`\>\>

The download result including payload and metadata.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`downloadObject`](Class.BlobStorageStrategyBase#downloadobject)

---

### inspectObjectHistory()

```ts
inspectObjectHistory(request): Promise<IBlobObjectHistoryResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:236](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L236)

Observes one exact-key history page, including available versions, snapshots and soft deletion.

Does not inspect container restoration, backups or other recovery systems.

#### Parameters

| Parameter | Type                                                               | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `request` | [`IBlobObjectHistoryRequest`](Interface.IBlobObjectHistoryRequest) | Exact key, bounded page and cancellation budget. |

#### Returns

`Promise`\<[`IBlobObjectHistoryResult`](Interface.IBlobObjectHistoryResult)\>

Provider observations, never an implicit irreversible-deletion guarantee.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`inspectObjectHistory`](Class.BlobStorageStrategyBase#inspectobjecthistory)

---

### listObjects()

```ts
listObjects(request?): Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:195](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L195)

Lists objects of a bucket page by page.

Optional because not every backing store can enumerate its contents. Consumers that reconcile
their own bookkeeping against actual storage depend on it, so a strategy that can enumerate
should implement it rather than leaving the capability unavailable.

#### Parameters

| Parameter  | Type                                             | Description                                                        |
| ---------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `request?` | [`IBlobListRequest`](Interface.IBlobListRequest) | The listing request describing prefix, page size and continuation. |

#### Returns

`Promise`\<[`IBlobListResult`](Interface.IBlobListResult)\>

One page of entries and the token for the next page.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`listObjects`](Class.BlobStorageStrategyBase#listobjects)

---

### objectExists()

```ts
objectExists(request): Promise<boolean>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:184](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L184)

Determines whether a blob object exists in the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `request` | [`IBlobExistsRequest`](Interface.IBlobExistsRequest) | The request describing the object to inspect. |

#### Returns

`Promise`\<`boolean`\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`objectExists`](Class.BlobStorageStrategyBase#objectexists)

---

### supportsExecutionOptions()

```ts
supportsExecutionOptions(operation): boolean;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L93)

Reports whether an existing operation honors explicit execution limits.

Missing support must reject requested limits before provider I/O. Ordinary
calls without limits retain their existing behavior.

#### Parameters

| Parameter   | Type                                                         | Description                                     |
| ----------- | ------------------------------------------------------------ | ----------------------------------------------- |
| `operation` | [`BlobExecutionOperation`](TypeAlias.BlobExecutionOperation) | Existing upload, download or listing operation. |

#### Returns

`boolean`

Whether deadlines, cancellation and applicable byte limits are enforced.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`supportsExecutionOptions`](Class.BlobStorageStrategyBase#supportsexecutionoptions)

---

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:98](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L98)

Uploads a blob object to the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobUploadRequest`](Interface.IBlobUploadRequest) | The upload request describing the object to upload. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The resulting upload metadata.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`uploadObject`](Class.BlobStorageStrategyBase#uploadobject)
