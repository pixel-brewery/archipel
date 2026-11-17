---
title: 'Interface: IBlobMultipartUploadStartRequest'
generated: true
editUrl: false
---

# Interface: IBlobMultipartUploadStartRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L11)

Starts an object upload that is transferred in separately uploaded parts.

Content type, disposition and metadata are fixed when the upload starts because some providers
accept them only then. The completed object carries exactly these values.

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L18)

---

### contentDisposition?

```ts
contentDisposition?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L15)

Value of the `Content-Disposition` header the completed object is served with.

---

### contentType?

```ts
contentType?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L13)

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L12)

---

### metadata?

```ts
metadata?: Record<string, string>;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L16)

---

### ownerUserId?

```ts
ownerUserId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L17)
