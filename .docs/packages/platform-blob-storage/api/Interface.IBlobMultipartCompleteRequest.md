---
title: 'Interface: IBlobMultipartCompleteRequest'
generated: true
editUrl: false
---

# Interface: IBlobMultipartCompleteRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L71)

Completes a multipart upload from the receipts of its parts.

## Properties

### parts

```ts
parts: readonly IBlobMultipartPart[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L74)

Every part of the object exactly once; the order of this list is irrelevant.

---

### upload

```ts
upload: IBlobMultipartUpload;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:72](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L72)
