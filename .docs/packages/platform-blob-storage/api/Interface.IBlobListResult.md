---
title: 'Interface: IBlobListResult'
generated: true
editUrl: false
---

# Interface: IBlobListResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L136)

One page of a bucket listing.

## Properties

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:140](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L140)

Token to pass to the next call; absent when the listing is complete.

---

### entries

```ts
entries: IBlobListEntry[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L137)
