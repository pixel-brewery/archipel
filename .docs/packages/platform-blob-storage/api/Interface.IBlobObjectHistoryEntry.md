---
title: 'Interface: IBlobObjectHistoryEntry'
generated: true
editUrl: false
---

# Interface: IBlobObjectHistoryEntry

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L8)

One current, versioned, snapshot or soft-deleted object observed by the provider.

Missing optional facts are unknown, not proof of irreversible deletion.

## Properties

### deleted

```ts
readonly deleted: boolean;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L13)

---

### deletedAt?

```ts
readonly deletedAt?: Date;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L15)

---

### etag?

```ts
readonly etag?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L14)

---

### isCurrentVersion?

```ts
readonly isCurrentVersion?: boolean;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L12)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L9)

---

### remainingRetentionDays?

```ts
readonly remainingRetentionDays?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L16)

---

### snapshotId?

```ts
readonly snapshotId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L11)

---

### versionId?

```ts
readonly versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobObjectHistoryEntry.ts#L10)
