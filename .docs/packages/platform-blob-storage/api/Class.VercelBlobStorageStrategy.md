---
title: 'Class: VercelBlobStorageStrategy'
generated: true
editUrl: false
---

# Class: VercelBlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L33)

Provides a blob storage strategy backed by the Vercel Blob API.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new VercelBlobStorageStrategy(httpService, configService): VercelBlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L56)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L83)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string | undefined;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L86)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:196](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L196)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:145](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L145)

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

### downloadObject()

```ts
downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:123](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L123)

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

### listObjects()

```ts
listObjects(request?): Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:172](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L172)

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

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:158](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L158)

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

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts:95](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/vercel/VercelBlobStorageStrategy.ts#L95)

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
