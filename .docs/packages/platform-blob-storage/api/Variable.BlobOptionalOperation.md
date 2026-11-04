---
title: 'Variable: BlobOptionalOperation'
generated: true
editUrl: false
---

# Variable: BlobOptionalOperation

```ts
const readonly BlobOptionalOperation: {
  CreateSignedUrl: "createSignedUrl";
  DeleteObjectConditionally: "deleteObjectConditionally";
  InspectObjectHistory: "inspectObjectHistory";
  ListObjects: "listObjects";
};
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L79)

Storage operations that not every provider can perform.

Providers differ in what their backing store supports. Rather than growing one boolean per
capability, callers ask for the operation they intend to use.

## Type Declaration

| Name                                                                        | Type                          | Default value                 | Defined in                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-createsignedurl"></a> `CreateSignedUrl`                     | `"createSignedUrl"`           | `'createSignedUrl'`           | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L80) |
| <a id="property-deleteobjectconditionally"></a> `DeleteObjectConditionally` | `"deleteObjectConditionally"` | `'deleteObjectConditionally'` | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L83) |
| <a id="property-inspectobjecthistory"></a> `InspectObjectHistory`           | `"inspectObjectHistory"`      | `'inspectObjectHistory'`      | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L82) |
| <a id="property-listobjects"></a> `ListObjects`                             | `"listObjects"`               | `'listObjects'`               | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L81) |
