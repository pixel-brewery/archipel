---
title: 'Interface: IBlobDownloadRequest'
generated: true
editUrl: false
---

# Interface: IBlobDownloadRequest

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:143](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L143)

## Properties

### bucket?

```ts
bucket?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:147](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L147)

---

### execution?

```ts
execution?: IBlobExecutionOptions;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:149](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L149)

Explicit guaranteed execution limits, including response-body consumption.

---

### key

```ts
key: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L144)

---

### maxBytes?

```ts
maxBytes?: number;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:151](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L151)

Nonnegative safe integer byte limit; exceeding it aborts the response stream.

---

### responseType?

```ts
responseType?: BlobDownloadResponseType;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:146](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L146)

---

### versionId?

```ts
versionId?: string;
```

Defined in: [libs/platform-blob-storage/src/interfaces/IBlobProvider.ts:145](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-blob-storage/src/interfaces/IBlobProvider.ts#L145)
