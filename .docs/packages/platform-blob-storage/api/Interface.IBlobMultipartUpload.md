---
title: 'Interface: IBlobMultipartUpload'
generated: true
editUrl: false
---

# Interface: IBlobMultipartUpload

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L29)

Serializable handle of a started multipart upload.

Callers persist it between processes to continue the same upload later. It contains no
credentials. Treat it as opaque apart from its documented fields.

## Properties

### bucket?

```ts
readonly bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L32)

---

### contentDisposition?

```ts
readonly contentDisposition?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L35)

---

### contentType

```ts
readonly contentType: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L34)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L31)

---

### metadata?

```ts
readonly metadata?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L36)

---

### ownerUserId?

```ts
readonly ownerUserId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L37)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L30)

---

### uploadId

```ts
readonly uploadId: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobMultipartUpload.ts#L33)
