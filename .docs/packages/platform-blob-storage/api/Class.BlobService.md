---
title: 'Class: BlobService'
generated: true
editUrl: false
---

# Class: BlobService

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L38)

Provides a generic abstraction for blob storage operations independent of the underlying provider.

## Constructors

### Constructor

```ts
new BlobService(
   storageStrategy,
   objectPersistence,
   variantPersistence
): BlobService;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L58)

Initializes a new instance of the BlobService class.

#### Parameters

| Parameter            | Type                                                                          | Description                                               |
| -------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| `storageStrategy`    | [`BlobStorageStrategyBase`](Class.BlobStorageStrategyBase)                    | The concrete blob storage strategy implementation.        |
| `objectPersistence`  | \| [`BlobObjectPersistenceBase`](Class.BlobObjectPersistenceBase) \| `null`   | Optional abstract base persisting original blob metadata. |
| `variantPersistence` | \| [`BlobVariantPersistenceBase`](Class.BlobVariantPersistenceBase) \| `null` | Optional abstract base persisting derived blob metadata.  |

#### Returns

`BlobService`

## Methods

### createSignedUrl()

```ts
createSignedUrl(request): Promise<string>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:186](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L186)

Generates a signed URL for the specified object.

#### Parameters

| Parameter | Type                                                       | Description                        |
| --------- | ---------------------------------------------------------- | ---------------------------------- |
| `request` | [`IBlobSignedUrlRequest`](Interface.IBlobSignedUrlRequest) | The request describing the object. |

#### Returns

`Promise`\<`string`\>

A signed URL that can be used to access the object.

---

### deleteFile()

```ts
deleteFile(key): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:343](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L343)

Deletes a file by key.

#### Parameters

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `key`     | `string` | The object key. |

#### Returns

`Promise`\<`void`\>

---

### deleteObject()

```ts
deleteObject(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L144)

Deletes an object from the configured blob provider.

#### Parameters

| Parameter | Type                                                 | Description                               |
| --------- | ---------------------------------------------------- | ----------------------------------------- |
| `request` | [`IBlobDeleteRequest`](Interface.IBlobDeleteRequest) | The delete request describing the object. |

#### Returns

`Promise`\<`void`\>

---

### deleteObjectConditionally()

```ts
deleteObjectConditionally(request): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:259](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L259)

Deletes only the selected object that still has its exact observed strong ETag.

Failed preconditions and unavailable objects throw without updating persistence.
Deleting historical versions or snapshots does not release the base object's metadata.
Base metadata uses only the optional generation-CAS hook and a verified resource identity.
A successful provider deletion does not by itself prove that metadata was changed.
Cancellation bounds client I/O, not a provider mutation already accepted remotely.

#### Parameters

| Parameter | Type                                                                       | Description                                                      |
| --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `request` | [`IBlobConditionalDeleteRequest`](Interface.IBlobConditionalDeleteRequest) | Exact ETag, optional immutable selector and cancellation budget. |

#### Returns

`Promise`\<`void`\>

---

### downloadFile()

```ts
downloadFile<TData>(key, responseType?): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:328](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L328)

Downloads a file by key.

#### Type Parameters

| Type Parameter                            |
| ----------------------------------------- |
| <a id="type-parameter-tdata"></a> `TData` |

#### Parameters

| Parameter       | Type                                                             | Description                 |
| --------------- | ---------------------------------------------------------------- | --------------------------- |
| `key`           | `string`                                                         | The object key.             |
| `responseType?` | [`BlobDownloadResponseType`](TypeAlias.BlobDownloadResponseType) | The expected response type. |

#### Returns

`Promise`\<[`IBlobDownloadResult`](Interface.IBlobDownloadResult)\<`TData`\>\>

The downloaded data and related metadata.

---

### downloadObject()

```ts
downloadObject<TData>(request): Promise<IBlobDownloadResult<TData>>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L129)

Downloads an object from the configured blob provider.

#### Type Parameters

| Type Parameter                              |
| ------------------------------------------- |
| <a id="type-parameter-tdata-1"></a> `TData` |

#### Parameters

| Parameter | Type                                                     | Description                                 |
| --------- | -------------------------------------------------------- | ------------------------------------------- |
| `request` | [`IBlobDownloadRequest`](Interface.IBlobDownloadRequest) | The download request describing the object. |

#### Returns

`Promise`\<[`IBlobDownloadResult`](Interface.IBlobDownloadResult)\<`TData`\>\>

The downloaded data and related metadata.

---

### fileExists()

```ts
fileExists(key): Promise<boolean>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:358](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L358)

Determines whether a file exists by key.

#### Parameters

| Parameter | Type     | Description     |
| --------- | -------- | --------------- |
| `key`     | `string` | The object key. |

#### Returns

`Promise`\<`boolean`\>

`true` when the file exists; otherwise `false`.

---

### inspectObjectHistory()

```ts
inspectObjectHistory(request): Promise<IBlobObjectHistoryResult>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:235](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L235)

Reads one exact-key page of versions, snapshots and soft-deletion observations.

Unsupported providers and failed reads throw; neither becomes an empty successful page.
Callers must follow continuation tokens and separately assess other recovery systems.

#### Parameters

| Parameter | Type                                                               | Description                                      |
| --------- | ------------------------------------------------------------------ | ------------------------------------------------ |
| `request` | [`IBlobObjectHistoryRequest`](Interface.IBlobObjectHistoryRequest) | Exact key, bounded page and cancellation budget. |

#### Returns

`Promise`\<[`IBlobObjectHistoryResult`](Interface.IBlobObjectHistoryResult)\>

One provider history page within the configured resource.

---

### listObjects()

```ts
listObjects(request?): Promise<IBlobListResult>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:212](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L212)

Lists objects of the configured bucket page by page.

Not every provider can enumerate its contents; callers that depend on enumeration should treat
[BlobStorageUnsupportedOperationError](Class.BlobStorageUnsupportedOperationError) as a missing capability rather than a failure.

#### Parameters

| Parameter  | Type                                             | Description                                                        |
| ---------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| `request?` | [`IBlobListRequest`](Interface.IBlobListRequest) | The listing request describing prefix, page size and continuation. |

#### Returns

`Promise`\<[`IBlobListResult`](Interface.IBlobListResult)\>

One page of entries and the token for the next page.

---

### objectExists()

```ts
objectExists(request): Promise<boolean>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:165](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L165)

Determines whether an object exists without downloading its contents.

#### Parameters

| Parameter | Type                                                 | Description                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------- |
| `request` | [`IBlobExistsRequest`](Interface.IBlobExistsRequest) | The request describing the object to inspect. |

#### Returns

`Promise`\<`boolean`\>

`true` when the object exists; otherwise `false`.

---

### supports()

```ts
supports(operation): boolean;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:285](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L285)

Determines whether the configured provider supports an optional operation.

Lets a caller adapt before attempting the operation instead of treating
[BlobStorageUnsupportedOperationError](Class.BlobStorageUnsupportedOperationError) as control flow.

#### Parameters

| Parameter   | Type                                                       | Description             |
| ----------- | ---------------------------------------------------------- | ----------------------- |
| `operation` | [`BlobOptionalOperation`](TypeAlias.BlobOptionalOperation) | The operation to probe. |

#### Returns

`boolean`

---

### supportsExecutionOptions()

```ts
supportsExecutionOptions(operation): boolean;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:296](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L296)

Probes guaranteed execution options on an existing operation.

#### Parameters

| Parameter   | Type                                                         | Description                            |
| ----------- | ------------------------------------------------------------ | -------------------------------------- |
| `operation` | [`BlobExecutionOperation`](TypeAlias.BlobExecutionOperation) | Upload, download or listing operation. |

#### Returns

`boolean`

Whether the strategy enforces requested execution and byte limits.

---

### uploadFile()

```ts
uploadFile(
   key,
   buffer,
   contentType?,
   metadata?
): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:309](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L309)

Uploads a buffer using the provided key.

#### Parameters

| Parameter      | Type                           | Description                     |
| -------------- | ------------------------------ | ------------------------------- |
| `key`          | `string`                       | The object key.                 |
| `buffer`       | `Buffer`                       | The data to upload.             |
| `contentType?` | `string`                       | The content type of the upload. |
| `metadata?`    | `Record`\<`string`, `string`\> | -                               |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The provider specific upload result.

---

### uploadObject()

```ts
uploadObject(request): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L79)

Uploads an object to the configured blob provider.

#### Parameters

| Parameter | Type                                                 | Description                               |
| --------- | ---------------------------------------------------- | ----------------------------------------- |
| `request` | [`IBlobUploadRequest`](Interface.IBlobUploadRequest) | The upload request describing the object. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The provider specific upload result.

---

### uploadVariant()

```ts
uploadVariant(
   originalId,
   label,
   request
): Promise<IBlobUploadResult>;
```

Defined in: [libs/platform-blob-storage/src/services/BlobService.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/services/BlobService.ts#L105)

Uploads a derived variant for an existing blob object.

#### Parameters

| Parameter    | Type                                                 | Description                                     |
| ------------ | ---------------------------------------------------- | ----------------------------------------------- |
| `originalId` | `string`                                             | The identifier of the original blob object.     |
| `label`      | `string`                                             | The variant label identifying the derivative.   |
| `request`    | [`IBlobUploadRequest`](Interface.IBlobUploadRequest) | The upload request describing the variant blob. |

#### Returns

`Promise`\<[`IBlobUploadResult`](Interface.IBlobUploadResult)\>

The provider specific upload result.
