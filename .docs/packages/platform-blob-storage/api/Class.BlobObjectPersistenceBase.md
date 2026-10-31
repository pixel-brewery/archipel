---
title: 'Abstract Class: BlobObjectPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: BlobObjectPersistenceBase

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L10)

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

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L28)

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

Defined in: [libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobObjectPersistenceBase.ts#L39)

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
