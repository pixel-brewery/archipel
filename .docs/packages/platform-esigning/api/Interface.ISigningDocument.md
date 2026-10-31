---
title: 'Interface: ISigningDocument'
generated: true
editUrl: false
---

# Interface: ISigningDocument

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L6)

Normalized representation of a document within a signing request.

## Properties

### contentType

```ts
readonly contentType: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L14)

MIME type of the document.

---

### documentId

```ts
readonly documentId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L8)

Provider-specific document identifier.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L11)

Display name of the document.

---

### order

```ts
readonly order: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L23)

Order of the document within the signing request.

---

### pageCount?

```ts
readonly pageCount?: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L20)

Number of pages in the document, if known.

---

### sizeInBytes?

```ts
readonly sizeInBytes?: number;
```

Defined in: [libs/platform-esigning/src/models/ISigningDocument.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningDocument.ts#L17)

Size of the document in bytes, if known.
