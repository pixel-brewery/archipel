---
title: 'Variable: BlobOptionalOperation'
generated: true
editUrl: false
---

# Variable: BlobOptionalOperation

```ts
const readonly BlobOptionalOperation: {
  CreateSignedUrl: "createSignedUrl";
  ListObjects: "listObjects";
};
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L77)

Storage operations that not every provider can perform.

Providers differ in what their backing store supports. Rather than growing one boolean per
capability, callers ask for the operation they intend to use.

## Type Declaration

| Name                                                    | Type                | Default value       | Defined in                                                                                                                                                                          |
| ------------------------------------------------------- | ------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-createsignedurl"></a> `CreateSignedUrl` | `"createSignedUrl"` | `'createSignedUrl'` | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L78) |
| <a id="property-listobjects"></a> `ListObjects`         | `"listObjects"`     | `'listObjects'`     | [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L79) |
