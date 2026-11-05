---
title: 'Interface: IBlobListEntry'
generated: true
editUrl: false
---

# Interface: IBlobListEntry

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:124](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L124)

One object of a bucket listing.

Listings carry only what every provider reports cheaply. Anything beyond that requires a
per-object head request and is deliberately not part of a listing.

## Properties

### etag?

```ts
etag?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:128](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L128)

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L125)

---

### lastModified?

```ts
lastModified?: Date;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:127](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L127)

---

### size

```ts
size: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:126](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L126)
