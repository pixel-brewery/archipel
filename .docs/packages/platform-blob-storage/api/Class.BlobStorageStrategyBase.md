---
title: 'Abstract Class: BlobStorageStrategyBase'
generated: true
editUrl: false
---

# Abstract Class: BlobStorageStrategyBase

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L23)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L41)

#### Returns

`BlobStorageStrategyBase`

## Properties

### defaultBucket?

```ts
abstract readonly defaultBucket?: string;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L34)

Gets the default bucket (container/directory) configured for the provider.

---

### providerId

```ts
abstract readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L29)

Gets the unique identifier for this storage provider.

## Methods

### createSignedUrl()?

```ts
createSignedUrl ? request : Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L92)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L74)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:127](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L127)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L66)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:116](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L116)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L105)

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

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L82)

Determines whether a blob object exists in the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `request` | [`IBlobExistsRequest`](Interface.IBlobExistsRequest) | The request describing the object to inspect. |

#### Returns

`Promise`\<`boolean`\>

---

### uploadObject()

```ts
abstract uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L57)

Uploads a blob object to the storage backend.

#### Parameters

| Parameter | Type                                                 | Description                                         |
| --------- | ---------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobUploadRequest`](Interface.IBlobUploadRequest) | The upload request describing the object to upload. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The resulting upload metadata.
