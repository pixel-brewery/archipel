---
title: 'Interface: IBlobMultipartPart'
generated: true
editUrl: false
---

# Interface: IBlobMultipartPart

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L59)

Serializable receipt of one uploaded part, required to complete the upload.

## Properties

### partNumber

```ts
readonly partNumber: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L60)

---

### size

```ts
readonly size: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L63)

---

### token

```ts
readonly token: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:62](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L62)

Provider receipt of the part. Opaque to callers.
