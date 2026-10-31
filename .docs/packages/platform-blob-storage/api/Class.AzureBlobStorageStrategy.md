---
title: 'Class: AzureBlobStorageStrategy'
generated: true
editUrl: false
---

# Class: AzureBlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L28)

Provides a blob storage strategy backed by Microsoft Azure Blob Storage.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new AzureBlobStorageStrategy(configService): AzureBlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L47)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L70)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string;
```

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L73)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:191](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L191)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L144)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:124](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L124)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:166](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L166)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:157](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L157)

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

Defined in: [libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/azure/AzureBlobStorageStrategy.ts#L82)

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
