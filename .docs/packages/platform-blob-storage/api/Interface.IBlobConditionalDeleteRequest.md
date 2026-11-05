---
title: 'Interface: IBlobConditionalDeleteRequest'
generated: true
editUrl: false
---

# Interface: IBlobConditionalDeleteRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L12)

Deletes only the object that still has the exact observed strong ETag.

At most one version or snapshot selector may be supplied. Omitting both selects
the base object. Empty selectors, wildcard/weak/list ETags and alternate buckets
are rejected rather than broadening the deletion.
Unselected snapshots and versions must remain unchanged. Associated snapshots
can require separate conditional deletions before the base object can be deleted.

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L22)

---

### bucket?

```ts
readonly bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L16)

---

### ifMatch

```ts
readonly ifMatch: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L19)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L13)

---

### resourceId?

```ts
readonly resourceId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L15)

Expected actual resource identity; when supplied, the provider must reject a mismatch before deletion.

---

### snapshotId?

```ts
readonly snapshotId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L18)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L21)

Whole milliseconds from 1 to 30,000; defaults to 30,000 across SDK retries.

---

### versionId?

```ts
readonly versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobConditionalDeleteRequest.ts#L17)
