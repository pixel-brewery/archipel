---
title: 'Interface: IBlobListRequest'
generated: true
editUrl: false
---

# Interface: IBlobListRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:94](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L94)

Describes one page of a bucket listing.

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:104](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L104)

---

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:99](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L99)

Continuation token of a previous page; omit to start at the beginning.

---

### maxKeys?

```ts
maxKeys?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:102](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L102)

Upper bound of entries per page. Providers may return fewer.

---

### prefix?

```ts
prefix?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L96)

Restricts the listing to keys starting with this prefix.
