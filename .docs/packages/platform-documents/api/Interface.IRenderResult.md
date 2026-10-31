---
title: 'Interface: IRenderResult'
generated: true
editUrl: false
---

# Interface: IRenderResult

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:125](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L125)

Document render result.

## Properties

### buffer

```ts
buffer: Buffer;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L129)

Document buffer.

---

### format

```ts
format: DocumentFormat;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:134](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L134)

Document format.

---

### mimeType

```ts
mimeType: string;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:139](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L139)

MIME type.

---

### report

```ts
report: IDocumentProbeReport | null;
```

Defined in: [libs/platform-documents/src/types/DocumentTypes.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/types/DocumentTypes.ts#L144)

Document probe report (null if not available)
