---
title: 'Interface: IBlobListRequest'
generated: true
editUrl: false
---

# Interface: IBlobListRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:101](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L101)

Describes one page of a bucket listing.

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L111)

---

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L106)

Continuation token of a previous page; omit to start at the beginning.

---

### execution?

```ts
execution?: IBlobExecutionOptions;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L113)

Explicit guaranteed execution limits for this page, including SDK retries.

---

### maxKeys?

```ts
maxKeys?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:109](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L109)

Upper bound of entries per page. Providers may return fewer.

---

### prefix?

```ts
prefix?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L103)

Restricts the listing to keys starting with this prefix.
