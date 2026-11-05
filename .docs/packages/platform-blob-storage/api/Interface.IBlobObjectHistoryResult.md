---
title: 'Interface: IBlobObjectHistoryResult'
generated: true
editUrl: false
---

# Interface: IBlobObjectHistoryResult

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L11)

One exact-key history page within the active provider's configured resource.

This does not inspect deleted containers, backups, replicas or external restore paths.
Even an empty page must be followed while a continuation token remains.

## Properties

### bucket

```ts
readonly bucket: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L15)

---

### continuationToken?

```ts
readonly continuationToken?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L17)

---

### entries

```ts
readonly entries: readonly IBlobObjectHistoryEntry[];
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L16)

---

### providerId

```ts
readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L12)

---

### resourceId

```ts
readonly resourceId: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryResult.ts#L14)

Actual resource endpoint without user information, credentials, query or fragment.
