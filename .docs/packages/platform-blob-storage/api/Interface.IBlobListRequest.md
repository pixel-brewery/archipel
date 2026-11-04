---
title: 'Interface: IBlobListRequest'
generated: true
editUrl: false
---

# Interface: IBlobListRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:98](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L98)

Describes one page of a bucket listing.

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L108)

---

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L103)

Continuation token of a previous page; omit to start at the beginning.

---

### maxKeys?

```ts
maxKeys?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L106)

Upper bound of entries per page. Providers may return fewer.

---

### prefix?

```ts
prefix?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:100](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L100)

Restricts the listing to keys starting with this prefix.
