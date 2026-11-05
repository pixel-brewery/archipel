---
title: 'Abstract Class: BlobObjectPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: BlobObjectPersistenceBase

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L11)

Abstract base for persisting blob object metadata.
Consuming projects must provide a concrete implementation (e.g. backed by Prisma, Mongo, etc.)
and register it via `BlobModule.forRoot({ objectPersistence: MyAdapter })`.

## Constructors

### Constructor

```ts
new BlobObjectPersistenceBase(): BlobObjectPersistenceBase;
```

#### Returns

`BlobObjectPersistenceBase`

## Methods

### createFromMetadata()

```ts
abstract createFromMetadata(metadata): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L29)

Persists metadata for a newly uploaded blob object.

#### Parameters

| Parameter  | Type                                                   | Description                                                     |
| ---------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| `metadata` | [`IBlobObjectMetadata`](Interface.IBlobObjectMetadata) | The object metadata returned by the blob provider after upload. |

#### Returns

`Promise`\<`void`\>

---

### markAsDeleted()

```ts
abstract markAsDeleted(
   provider,
   bucket,
   key,
   versionId?
): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L40)

Marks an existing blob object as deleted.

#### Parameters

| Parameter    | Type     | Description                      |
| ------------ | -------- | -------------------------------- |
| `provider`   | `string` | The storage provider identifier. |
| `bucket`     | `string` | The bucket name.                 |
| `key`        | `string` | The object key.                  |
| `versionId?` | `string` | Optional version identifier.     |

#### Returns

`Promise`\<`void`\>

---

### markAsDeletedIfUnchanged()?

```ts
markAsDeletedIfUnchanged ? request : Promise<boolean>;
```

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L52)

Marks only the atomically matched generation as deleted after a conditional provider deletion.

Compare provider, resource, bucket, key, exact ETag and any selector in the same write.
Missing capability, scope or a failed comparison must never fall back to key-only marking.

#### Parameters

| Parameter | Type                                                                                                 | Description                                              |
| --------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `request` | [`IBlobConditionalDeletionPersistenceRequest`](Interface.IBlobConditionalDeletionPersistenceRequest) | Verified provider scope and exact deletion precondition. |

#### Returns

`Promise`\<`boolean`\>

Whether the matching metadata generation was actually changed.
