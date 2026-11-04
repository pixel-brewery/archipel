---
title: 'Interface: IBlobListEntry'
generated: true
editUrl: false
---

# Interface: IBlobListEntry

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:119](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L119)

One object of a bucket listing.

Listings carry only what every provider reports cheaply. Anything beyond that requires a
per-object head request and is deliberately not part of a listing.

## Properties

### etag?

```ts
etag?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:123](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L123)

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L120)

---

### lastModified?

```ts
lastModified?: Date;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L122)

---

### size

```ts
size: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:121](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L121)
