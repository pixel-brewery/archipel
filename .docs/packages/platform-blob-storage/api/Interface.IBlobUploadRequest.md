---
title: 'Interface: IBlobUploadRequest'
generated: true
editUrl: false
---

# Interface: IBlobUploadRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L43)

## Properties

### body

```ts
body: BlobUploadBody;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L45)

---

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L51)

---

### checksumSha256?

```ts
checksumSha256?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L49)

---

### contentLength?

```ts
contentLength?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L47)

---

### contentType?

```ts
contentType?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L46)

---

### execution?

```ts
execution?: IBlobExecutionOptions;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L54)

Explicit guaranteed execution limits; unsupported strategies reject before I/O.

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L44)

---

### metadata?

```ts
metadata?: Record<string, string>;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L48)

---

### ownerUserId?

```ts
ownerUserId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L50)

---

### region?

```ts
region?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L52)
