---
title: 'Interface: IBlobObjectMetadata'
generated: true
editUrl: false
---

# Interface: IBlobObjectMetadata

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L24)

## Properties

### bucket

```ts
bucket: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L28)

---

### checksumSha256?

```ts
checksumSha256?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L35)

---

### contentType

```ts
contentType: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L33)

---

### etag?

```ts
etag?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L34)

---

### isLatest

```ts
isLatest: boolean;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L38)

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L30)

---

### metadata?

```ts
metadata?: Record<string, string>;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L37)

---

### ownerUserId?

```ts
ownerUserId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L39)

---

### provider

```ts
provider: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L25)

---

### region?

```ts
region?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L29)

---

### resourceId?

```ts
resourceId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L27)

Actual provider resource without credentials; absent when the provider cannot identify it.

---

### size

```ts
size: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L32)

---

### storageClass?

```ts
storageClass?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L36)

---

### versionId?

```ts
versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L31)
