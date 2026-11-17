---
title: 'Class: AzureBlobStorageStrategy'
generated: true
editUrl: false
---

# Class: AzureBlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L50)

Provides a blob storage strategy backed by Microsoft Azure Blob Storage.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new AzureBlobStorageStrategy(configService): AzureBlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L71)

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

### multipartUploadLimits

```ts
readonly multipartUploadLimits: IBlobMultipartUploadLimits;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:101](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L101)

Block blob limits: blocks of up to 4000 MiB, at most 50,000 committed blocks, no minimum size.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`multipartUploadLimits`](Class.BlobStorageStrategyBase#multipartuploadlimits)

---

### providerId

```ts
readonly providerId: string = 'azure';
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:94](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L94)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L108)

Gets the default bucket (container/directory) configured for the provider.

##### Returns

`string`

Gets the default bucket (container/directory) configured for the provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`defaultBucket`](Class.BlobStorageStrategyBase#defaultbucket)

## Methods

### abortMultipartUpload()

```ts
abortMultipartUpload(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:497](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L497)

Azure offers no operation that discards uncommitted blocks without touching a committed blob of
the same name; it discards them itself after seven days. Aborting therefore never deletes data.

#### Parameters

| Parameter | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `request` | [`IBlobMultipartAbortRequest`](Interface.IBlobMultipartAbortRequest) |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`abortMultipartUpload`](Class.BlobStorageStrategyBase#abortmultipartupload)

---

### completeMultipartUpload()

```ts
completeMultipartUpload(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:451](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L451)

Commits the staged blocks in ascending part order with the headers fixed at start.

#### Parameters

| Parameter | Type                                                                       |
| --------- | -------------------------------------------------------------------------- |
| `request` | [`IBlobMultipartCompleteRequest`](Interface.IBlobMultipartCompleteRequest) |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`completeMultipartUpload`](Class.BlobStorageStrategyBase#completemultipartupload)

---

### createMultipartUpload()

```ts
createMultipartUpload(request): Promise<IBlobMultipartUpload>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:413](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L413)

Starts a block blob upload. Azure keeps staged blocks per blob name, so the handle only reserves
a block-identifier namespace and performs no provider I/O.

#### Parameters

| Parameter | Type                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `request` | [`IBlobMultipartUploadStartRequest`](Interface.IBlobMultipartUploadStartRequest) |

#### Returns

`Promise`\<[`IBlobMultipartUpload`](Interface.IBlobMultipartUpload)\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`createMultipartUpload`](Class.BlobStorageStrategyBase#createmultipartupload)

---

### createSignedUrl()

```ts
createSignedUrl(request): Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:366](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L366)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:196](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L196)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:320](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L320)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:165](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L165)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:263](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L263)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:222](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L222)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:210](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L210)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:117](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L117)

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

### uploadMultipartPart()

```ts
uploadMultipartPart(request): Promise<IBlobMultipartPart>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:435](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L435)

Stages one uncommitted block; it stays invisible until the block list is committed.

#### Parameters

| Parameter | Type                                                               |
| --------- | ------------------------------------------------------------------ |
| `request` | [`IBlobMultipartPartRequest`](Interface.IBlobMultipartPartRequest) |

#### Returns

`Promise`\<[`IBlobMultipartPart`](Interface.IBlobMultipartPart)\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`uploadMultipartPart`](Class.BlobStorageStrategyBase#uploadmultipartpart)

---

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L122)

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
