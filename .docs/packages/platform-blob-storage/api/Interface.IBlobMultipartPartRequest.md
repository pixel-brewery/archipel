---
title: 'Interface: IBlobMultipartPartRequest'
generated: true
editUrl: false
---

# Interface: IBlobMultipartPartRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L47)

Uploads one part of a started multipart upload.

Uploading the same part number again replaces the earlier content of that part.

## Properties

### body

```ts
body: Buffer;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L51)

---

### partNumber

```ts
partNumber: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L50)

Positive integer within [IBlobMultipartUploadLimits.maximumParts](Interface.IBlobMultipartUploadLimits#maximumparts); parts are joined in ascending order.

---

### upload

```ts
upload: IBlobMultipartUpload;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L48)
