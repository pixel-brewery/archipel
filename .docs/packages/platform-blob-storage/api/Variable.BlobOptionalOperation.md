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
  MultipartUpload: "createMultipartUpload";
};
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:82](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L82)

Storage operations that not every provider can perform.

Providers differ in what their backing store supports. Rather than growing one boolean per
capability, callers ask for the operation they intend to use.

## Type Declaration

| Name                                                                        | Type                          | Default value                 | Description                                                            | Defined in                                                                                                                                                                          |
| --------------------------------------------------------------------------- | ----------------------------- | ----------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-createsignedurl"></a> `CreateSignedUrl`                     | `"createSignedUrl"`           | `'createSignedUrl'`           | -                                                                      | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L83) |
| <a id="property-deleteobjectconditionally"></a> `DeleteObjectConditionally` | `"deleteObjectConditionally"` | `'deleteObjectConditionally'` | -                                                                      | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L86) |
| <a id="property-inspectobjecthistory"></a> `InspectObjectHistory`           | `"inspectObjectHistory"`      | `'inspectObjectHistory'`      | -                                                                      | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L85) |
| <a id="property-listobjects"></a> `ListObjects`                             | `"listObjects"`               | `'listObjects'`               | -                                                                      | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L84) |
| <a id="property-multipartupload"></a> `MultipartUpload`                     | `"createMultipartUpload"`     | `'createMultipartUpload'`     | Covers starting, continuing, completing and aborting uploads in parts. | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L88) |
