---
title: 'Interface: IBlobListResult'
generated: true
editUrl: false
---

# Interface: IBlobListResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:131](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L131)

One page of a bucket listing.

## Properties

### continuationToken?

```ts
continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:135](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L135)

Token to pass to the next call; absent when the listing is complete.

---

### entries

```ts
entries: IBlobListEntry[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:132](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L132)
