---
title: 'Interface: ICreateSigningRequestDocument'
generated: true
editUrl: false
---

# Interface: ICreateSigningRequestDocument

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L41)

A document to include when creating a signing request.

## Properties

### content

```ts
readonly content: Buffer;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L49)

Document content as a buffer.

---

### contentType

```ts
readonly contentType: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L46)

MIME type of the document content.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L43)

Display name of the document.

---

### order

```ts
readonly order: number;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L52)

Order of the document within the request.
