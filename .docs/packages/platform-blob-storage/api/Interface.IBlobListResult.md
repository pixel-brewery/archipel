---
title: 'Interface: IBlobListResult'
generated: true
editUrl: false
---

# Interface: IBlobListResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:127](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L127)

One page of a bucket listing.

## Properties

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:131](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L131)

Token to pass to the next call; absent when the listing is complete.

---

### entries

```ts
entries: IBlobListEntry[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:128](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L128)
