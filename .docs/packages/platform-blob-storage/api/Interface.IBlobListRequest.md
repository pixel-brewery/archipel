---
title: 'Interface: IBlobListRequest'
generated: true
editUrl: false
---

# Interface: IBlobListRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L103)

Describes one page of a bucket listing.

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:113](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L113)

---

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:108](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L108)

Continuation token of a previous page; omit to start at the beginning.

---

### execution?

```ts
execution?: IBlobExecutionOptions;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L115)

Explicit guaranteed execution limits for this page, including SDK retries.

---

### maxKeys?

```ts
maxKeys?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L111)

Upper bound of entries per page. Providers may return fewer.

---

### prefix?

```ts
prefix?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L105)

Restricts the listing to keys starting with this prefix.
