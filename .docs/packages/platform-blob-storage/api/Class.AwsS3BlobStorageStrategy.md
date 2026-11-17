---
title: 'Class: AwsS3BlobStorageStrategy'
generated: true
editUrl: false
---

# Class: AwsS3BlobStorageStrategy

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L39)

Provides a blob storage strategy backed by Amazon S3.

## Extends

- [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)

## Constructors

### Constructor

```ts
new AwsS3BlobStorageStrategy(configService): AwsS3BlobStorageStrategy;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L60)

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

### multipartUploadLimits

```ts
readonly multipartUploadLimits: IBlobMultipartUploadLimits;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L97)

S3 multipart limits: parts of 5 MiB to 5 GiB except the last, at most 10,000 parts.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`multipartUploadLimits`](Class.BlobStorageStrategyBase#multipartuploadlimits)

---

### providerId

```ts
readonly providerId: string = 'aws-s3';
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:90](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L90)

Gets the unique identifier for this storage provider.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`providerId`](Class.BlobStorageStrategyBase#providerid)

## Accessors

### defaultBucket

#### Get Signature

```ts
get defaultBucket(): string;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:104](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L104)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:328](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L328)

Abandons a multipart upload and releases the parts the provider still holds.

Aborting an unknown, completed or already aborted upload succeeds without effect and never
removes a completed object.

#### Parameters

| Parameter | Type                                                                 | Description                      |
| --------- | -------------------------------------------------------------------- | -------------------------------- |
| `request` | [`IBlobMultipartAbortRequest`](Interface.IBlobMultipartAbortRequest) | Handle of the upload to abandon. |

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`abortMultipartUpload`](Class.BlobStorageStrategyBase#abortmultipartupload)

---

### completeMultipartUpload()

```ts
completeMultipartUpload(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:293](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L293)

Joins the uploaded parts in ascending part order and publishes the object under its key.

#### Parameters

| Parameter | Type                                                                       | Description                            |
| --------- | -------------------------------------------------------------------------- | -------------------------------------- |
| `request` | [`IBlobMultipartCompleteRequest`](Interface.IBlobMultipartCompleteRequest) | Handle and the receipts of every part. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

Metadata of the completed object.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`completeMultipartUpload`](Class.BlobStorageStrategyBase#completemultipartupload)

---

### createMultipartUpload()

```ts
createMultipartUpload(request): Promise<IBlobMultipartUpload>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:240](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L240)

Starts an upload whose content is transferred in separately uploaded parts.

A strategy that implements this operation implements all multipart operations and
[BlobStorageStrategyBase.multipartUploadLimits](Class.BlobStorageStrategyBase#multipartuploadlimits). The returned handle can be persisted and
continued in another process. Nothing is visible under the key before completion.

#### Parameters

| Parameter | Type                                                                             | Description                                         |
| --------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| `request` | [`IBlobMultipartUploadStartRequest`](Interface.IBlobMultipartUploadStartRequest) | Target key and the headers of the completed object. |

#### Returns

`Promise`\<[`IBlobMultipartUpload`](Interface.IBlobMultipartUpload)\>

Serializable handle of the started upload.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`createMultipartUpload`](Class.BlobStorageStrategyBase#createmultipartupload)

---

### createSignedUrl()

```ts
createSignedUrl(request): Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:222](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L222)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:187](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L187)

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

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`deleteObjectConditionally`](Class.BlobStorageStrategyBase#deleteobjectconditionally)

---

### downloadObject()

```ts
downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:160](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L160)

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

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`inspectObjectHistory`](Class.BlobStorageStrategyBase#inspectobjecthistory)

---

### listObjects()

```ts
listObjects(request?): Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:346](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L346)

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

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:205](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L205)

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

#### Inherited from

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`supportsExecutionOptions`](Class.BlobStorageStrategyBase#supportsexecutionoptions)

---

### uploadMultipartPart()

```ts
uploadMultipartPart(request): Promise<IBlobMultipartPart>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:271](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L271)

Uploads one part of a started multipart upload.

#### Parameters

| Parameter | Type                                                               | Description                                  |
| --------- | ------------------------------------------------------------------ | -------------------------------------------- |
| `request` | [`IBlobMultipartPartRequest`](Interface.IBlobMultipartPartRequest) | Handle, part number and content of the part. |

#### Returns

`Promise`\<[`IBlobMultipartPart`](Interface.IBlobMultipartPart)\>

Receipt that completes the upload together with the other parts.

#### Overrides

[`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase).[`uploadMultipartPart`](Class.BlobStorageStrategyBase#uploadmultipartpart)

---

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/strategies/aws-s3/AwsS3BlobStorageStrategy.ts#L113)

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
