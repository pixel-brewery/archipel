---
title: 'Abstract Class: BlobStorageStrategyBase'
generated: true
editUrl: false
---

# Abstract Class: BlobStorageStrategyBase

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L33)

Abstract base class for blob storage strategies.
Every concrete provider (AWS S3, Azure, Vercel, Local, etc.) must extend this class.
Serves as both the type contract and the NestJS DI token type reference.

## Extended by

- [`VercelBlobStorageStrategy`](Class.VercelBlobStorageStrategy)
- [`AzureBlobStorageStrategy`](Class.AzureBlobStorageStrategy)
- [`AwsS3BlobStorageStrategy`](Class.AwsS3BlobStorageStrategy)
- [`EmptyBlobStorageStrategy`](Class.EmptyBlobStorageStrategy)
- [`LocalBlobStorageStrategy`](Class.LocalBlobStorageStrategy)

## Constructors

### Constructor

```ts
protected new BlobStorageStrategyBase(): BlobStorageStrategyBase;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L58)

#### Returns

`BlobStorageStrategyBase`

## Properties

### defaultBucket?

```ts
abstract readonly defaultBucket?: string;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L44)

Gets the default bucket (container/directory) configured for the provider.

---

### multipartUploadLimits?

```ts
readonly multipartUploadLimits?: IBlobMultipartUploadLimits;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L51)

Gets the part limits of multipart uploads; present exactly when the strategy implements them.

---

### providerId

```ts
abstract readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L39)

Gets the unique identifier for this storage provider.

## Methods

### abortMultipartUpload()?

```ts
abortMultipartUpload ? request : Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:198](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L198)

Abandons a multipart upload and releases the parts the provider still holds.

Aborting an unknown, completed or already aborted upload succeeds without effect and never
removes a completed object.

#### Parameters

| Parameter | Type                                                                 | Description                      |
| --------- | -------------------------------------------------------------------- | -------------------------------- |
| `request` | [`IBlobMultipartAbortRequest`](Interface.IBlobMultipartAbortRequest) | Handle of the upload to abandon. |

#### Returns

`Promise`\<`void`\>

---

### completeMultipartUpload()?

```ts
completeMultipartUpload ? request : Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:187](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L187)

Joins the uploaded parts in ascending part order and publishes the object under its key.

#### Parameters

| Parameter | Type                                                                       | Description                            |
| --------- | -------------------------------------------------------------------------- | -------------------------------------- |
| `request` | [`IBlobMultipartCompleteRequest`](Interface.IBlobMultipartCompleteRequest) | Handle and the receipts of every part. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

Metadata of the completed object.

---

### createMultipartUpload()?

```ts
createMultipartUpload ? request : Promise<IBlobMultipartUpload>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L169)

Starts an upload whose content is transferred in separately uploaded parts.

A strategy that implements this operation implements all multipart operations and
[BlobStorageStrategyBase.multipartUploadLimits](#multipartuploadlimits). The returned handle can be persisted and
continued in another process. Nothing is visible under the key before completion.

#### Parameters

| Parameter | Type                                                                             | Description                                         |
| --------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobMultipartUploadStartRequest`](Interface.IBlobMultipartUploadStartRequest) | Target key and the headers of the completed object. |

#### Returns

`Promise`\<[`IBlobMultipartUpload`](Interface.IBlobMultipartUpload)\>

Serializable handle of the started upload.

---

### createSignedUrl()?

```ts
createSignedUrl ? request : Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:121](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L121)

Creates a signed URL for the specified blob object.
Not all providers support this operation.

#### Parameters

| Parameter | Type                                                       | Description                                |
| --------- | ---------------------------------------------------------- | ------------------------------------------ |
| `request` | [`IBlobSignedUrlRequest`](Interface.IBlobSignedUrlRequest) | The request describing the object to link. |

#### Returns

`Promise`\<`string`\>

The generated signed URL.

---

### deleteObject()

```ts
abstract deleteObject(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L103)

Deletes a blob object from the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobDeleteRequest`](Interface.IBlobDeleteRequest) | The delete request describing the object to remove. |

#### Returns

`Promise`\<`void`\>

---

### deleteObjectConditionally()?

```ts
deleteObjectConditionally ? request : Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:156](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L156)

Deletes the selected object only while its exact observed ETag still matches.

A supplied resource identity must match the actual target before deletion.
Client cancellation does not undo a mutation already accepted by the provider.

#### Parameters

| Parameter | Type                                                                       | Description                                                      |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `request` | [`IBlobConditionalDeleteRequest`](Interface.IBlobConditionalDeleteRequest) | Exact ETag, optional immutable selector and cancellation budget. |

#### Returns

`Promise`\<`void`\>

---

### downloadObject()

```ts
abstract downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:95](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L95)

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

---

### inspectObjectHistory()?

```ts
inspectObjectHistory ? request : Promise<IBlobObjectHistoryResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:145](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L145)

Observes one exact-key history page, including available versions, snapshots and soft deletion.

Does not inspect container restoration, backups or other recovery systems.

#### Parameters

| Parameter | Type                                                               | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `request` | [`IBlobObjectHistoryRequest`](Interface.IBlobObjectHistoryRequest) | Exact key, bounded page and cancellation budget. |

#### Returns

`Promise`\<[`IBlobObjectHistoryResult`](Interface.IBlobObjectHistoryResult)\>

Provider observations, never an implicit irreversible-deletion guarantee.

---

### listObjects()?

```ts
listObjects ? request : Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:134](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L134)

Lists objects of a bucket page by page.

Optional because not every backing store can enumerate its contents. Consumers that reconcile
their own bookkeeping against actual storage depend on it, so a strategy that can enumerate
should implement it rather than leaving the capability unavailable.

#### Parameters

| Parameter | Type                                             | Description                                                        |
| --------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `request` | [`IBlobListRequest`](Interface.IBlobListRequest) | The listing request describing prefix, page size and continuation. |

#### Returns

`Promise`\<[`IBlobListResult`](Interface.IBlobListResult)\>

One page of entries and the token for the next page.

---

### objectExists()

```ts
abstract objectExists(request): Promise<boolean>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L111)

Determines whether a blob object exists in the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `request` | [`IBlobExistsRequest`](Interface.IBlobExistsRequest) | The request describing the object to inspect. |

#### Returns

`Promise`\<`boolean`\>

---

### supportsExecutionOptions()?

```ts
supportsExecutionOptions ? operation : boolean;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L77)

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

---

### uploadMultipartPart()?

```ts
uploadMultipartPart ? request : Promise<IBlobMultipartPart>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:178](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L178)

Uploads one part of a started multipart upload.

#### Parameters

| Parameter | Type                                                               | Description                                  |
| --------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `request` | [`IBlobMultipartPartRequest`](Interface.IBlobMultipartPartRequest) | Handle, part number and content of the part. |

#### Returns

`Promise`\<[`IBlobMultipartPart`](Interface.IBlobMultipartPart)\>

Receipt that completes the upload together with the other parts.

---

### uploadObject()

```ts
abstract uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L86)

Uploads a blob object to the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobUploadRequest`](Interface.IBlobUploadRequest) | The upload request describing the object to upload. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The resulting upload metadata.
