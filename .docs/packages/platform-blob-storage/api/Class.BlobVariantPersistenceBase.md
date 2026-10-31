---
title: 'Abstract Class: BlobVariantPersistenceBase'
generated: true
editUrl: false
---

# Abstract Class: BlobVariantPersistenceBase

Defined in: [libs/platform-blob-storage/src/abstracts/BlobVariantPersistenceBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobVariantPersistenceBase.ts#L10)

Abstract base for persisting blob variant metadata.
Consuming projects must provide a concrete implementation and register it
via `BlobModule.forRoot({ variantPersistence: MyAdapter })`.

## Constructors

### Constructor

```ts
new BlobVariantPersistenceBase(): BlobVariantPersistenceBase;
```

#### Returns

`BlobVariantPersistenceBase`

## Methods

### createFromMetadata()

```ts
abstract createFromMetadata(
   originalId,
   label,
   metadata
): Promise<void>;
```

Defined in: [libs/platform-blob-storage/src/abstracts/BlobVariantPersistenceBase.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/abstracts/BlobVariantPersistenceBase.ts#L30)

Persists metadata for a newly created blob variant.

#### Parameters

| Parameter    | Type                                                   | Description                                                     |
| ------------ | ------------------------------------------------------ | --------------------------------------------------------------- |
| `originalId` | `string`                                               | The identifier of the original blob object.                     |
| `label`      | `string`                                               | A label describing the variant (e.g. 'thumbnail', 'preview').   |
| `metadata`   | [`IBlobObjectMetadata`](Interface.IBlobObjectMetadata) | The object metadata returned by the blob provider after upload. |

#### Returns

`Promise`\<`void`\>
