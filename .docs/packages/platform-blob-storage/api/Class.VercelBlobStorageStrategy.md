---
title: 'Class: VercelBlobStorageStrategy'
generated: true
editUrl: false
---

# Class: VercelBlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L34)

Provides a blob storage strategy backed by the Vercel Blob API.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new VercelBlobStorageStrategy(httpService, configService): VercelBlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L57)

Initializes a new instance of the VercelBlobStorageStrategy class.

#### Parameters

| Parameter       | Type            | Description                                                    |
| --------------- | --------------- | -------------------------------------------------------------- |
| `httpService`   | `HttpService`   | The HTTP service used to communicate with the Vercel Blob API. |
| `configService` | `ConfigService` | The configuration service providing environment values.        |

#### Returns

`VercelBlobStorageStrategy`

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`constructor`](Class.BlobStorageStrategyBase#constructor)

## Properties

### providerId

```ts
readonly providerId: string = 'vercel';
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L84)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string | undefined;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L87)

Gets the default bucket (container/directory) configured for the provider.

##### Returns

`string` \| `undefined`

Gets the default bucket (container/directory) configured for the provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`defaultBucket`](Class.BlobStorageStrategyBase#defaultbucket)

## Methods

### createSignedUrl()

```ts
createSignedUrl(request): Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:200](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L200)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:148](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L148)

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

### deleteObjectConditionally()?

```ts
deleteObjectConditionally ? request : Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:140](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L140)

Deletes the selected object only while its exact observed ETag still matches.

A supplied resource identity must match the actual target before deletion.
Client cancellation does not undo a mutation already accepted by the provider.

#### Parameters

| Parameter | Type                                                                       | Description                                                      |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `request` | [`IBlobConditionalDeleteRequest`](Interface.IBlobConditionalDeleteRequest) | Exact ETag, optional immutable selector and cancellation budget. |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`deleteObjectConditionally`](Class.BlobStorageStrategyBase#deleteobjectconditionally)

---

### downloadObject()

```ts
downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L125)

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

### inspectObjectHistory()?

```ts
inspectObjectHistory ? request : Promise<IBlobObjectHistoryResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L129)

Observes one exact-key history page, including available versions, snapshots and soft deletion.

Does not inspect container restoration, backups or other recovery systems.

#### Parameters

| Parameter | Type                                                               | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `request` | [`IBlobObjectHistoryRequest`](Interface.IBlobObjectHistoryRequest) | Exact key, bounded page and cancellation budget. |

#### Returns

`Promise`\<[`IBlobObjectHistoryResult`](Interface.IBlobObjectHistoryResult)\>

Provider observations, never an implicit irreversible-deletion guarantee.

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`inspectObjectHistory`](Class.BlobStorageStrategyBase#inspectobjecthistory)

---

### listObjects()

```ts
listObjects(request?): Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:175](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L175)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:161](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L161)

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

### supportsExecutionOptions()?

```ts
supportsExecutionOptions ? operation : boolean;
```

Defined in: [libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/abstracts/BlobStorageStrategyBase.ts#L61)

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

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`supportsExecutionOptions`](Class.BlobStorageStrategyBase#supportsexecutionoptions)

---

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L96)

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
