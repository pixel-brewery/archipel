---
title: 'Interface: IBlobListResult'
generated: true
editUrl: false
---

# Interface: IBlobListResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:138](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L138)

One page of a bucket listing.

## Properties

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:142](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L142)

Token to pass to the next call; absent when the listing is complete.

---

### entries

```ts
entries: IBlobListEntry[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:139](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L139)
