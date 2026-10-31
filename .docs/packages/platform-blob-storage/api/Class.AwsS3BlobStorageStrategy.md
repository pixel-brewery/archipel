---
title: 'Class: AwsS3BlobStorageStrategy'
generated: true
editUrl: false
---

# Class: AwsS3BlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L29)

Provides a blob storage strategy backed by Amazon S3.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new AwsS3BlobStorageStrategy(configService): AwsS3BlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L50)

Initializes a new instance of the AwsS3BlobStorageStrategy class.

#### Parameters

| Parameter       | Type            | Description                                             |
| --------------- | --------------- | ------------------------------------------------------- |
| `configService` | `ConfigService` | The configuration service providing environment values. |

#### Returns

`AwsS3BlobStorageStrategy`

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`constructor`](Class.BlobStorageStrategyBase#constructor)

## Properties

### providerId

```ts
readonly providerId: string = 'aws-s3';
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L80)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L83)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:197](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L197)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:162](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L162)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L137)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:219](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L219)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:180](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L180)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L92)

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
