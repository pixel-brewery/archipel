---
title: 'Interface: IBlobConditionalDeletionPersistenceRequest'
generated: true
editUrl: false
---

# Interface: IBlobConditionalDeletionPersistenceRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L9)

Identifies the exact generation whose conditional provider deletion succeeded.

Persistence adapters must compare all scope and generation fields atomically.
A different or missing generation must remain unchanged.

## Properties

### bucket

```ts
readonly bucket: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L12)

---

### ifMatch

```ts
readonly ifMatch: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L14)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L13)

---

### providerId

```ts
readonly providerId: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L10)

---

### resourceId

```ts
readonly resourceId: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L11)

---

### snapshotId?

```ts
readonly snapshotId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L16)

---

### versionId?

```ts
readonly versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeletionPersistenceRequest.ts#L15)
