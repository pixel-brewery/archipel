---
title: 'Interface: IBlobObjectMetadata'
generated: true
editUrl: false
---

# Interface: IBlobObjectMetadata

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L25)

## Properties

### bucket

```ts
bucket: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L29)

---

### checksumSha256?

```ts
checksumSha256?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L36)

---

### contentType

```ts
contentType: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L34)

---

### etag?

```ts
etag?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L35)

---

### isLatest

```ts
isLatest: boolean;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L39)

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L31)

---

### metadata?

```ts
metadata?: Record<string, string>;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L38)

---

### ownerUserId?

```ts
ownerUserId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L40)

---

### provider

```ts
provider: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L26)

---

### region?

```ts
region?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L30)

---

### resourceId?

```ts
resourceId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L28)

Actual provider resource without credentials; absent when the provider cannot identify it.

---

### size

```ts
size: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L33)

---

### storageClass?

```ts
storageClass?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L37)

---

### versionId?

```ts
versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L32)
