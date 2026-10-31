---
title: 'Interface: ISignedDocument'
generated: true
editUrl: false
---

# Interface: ISignedDocument

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L6)

Normalized representation of a signed (completed) document.

## Properties

### content

```ts
readonly content: Buffer;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L20)

The signed document content as a buffer.

---

### contentType

```ts
readonly contentType: string;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L17)

MIME type of the signed document.

---

### documentId

```ts
readonly documentId: string;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L8)

Provider-specific document identifier.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L14)

Display name of the signed document.

---

### signingRequestId

```ts
readonly signingRequestId: string;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L11)

Signing request this document belongs to.

---

### sizeInBytes

```ts
readonly sizeInBytes: number;
```

Defined in: [libs/platform-esigning/src/models/ISignedDocument.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISignedDocument.ts#L23)

Size of the signed document in bytes.
