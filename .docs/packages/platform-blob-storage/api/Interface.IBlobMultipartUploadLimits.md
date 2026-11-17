---
title: 'Interface: IBlobMultipartUploadLimits'
generated: true
editUrl: false
---

# Interface: IBlobMultipartUploadLimits

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L91)

Provider limits a multipart upload must respect.

## Properties

### maximumPartBytes

```ts
readonly maximumPartBytes: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:95](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L95)

Largest size of a single part.

---

### maximumParts

```ts
readonly maximumParts: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L97)

Highest permitted part number and therefore the largest number of parts.

---

### minimumPartBytes

```ts
readonly minimumPartBytes: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L93)

Smallest size of every part except the one with the highest part number.
