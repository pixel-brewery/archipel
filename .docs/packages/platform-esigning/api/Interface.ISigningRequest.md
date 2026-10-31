---
title: 'Interface: ISigningRequest'
generated: true
editUrl: false
---

# Interface: ISigningRequest

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L15)

Normalized representation of a signing request (envelope/agreement).

## Properties

### createdAt

```ts
readonly createdAt: Date;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L38)

Timestamp when the signing request was created.

---

### documents

```ts
readonly documents: readonly ISigningDocument[];
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L32)

Documents included in this request.

---

### expiresAt?

```ts
readonly expiresAt?: Date;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L44)

Timestamp when the signing request expires, if applicable.

---

### fields

```ts
readonly fields: readonly ISigningField[];
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L35)

Fields placed across the documents.

---

### message?

```ts
readonly message?: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L26)

Optional message included with the signing request.

---

### providerMetadata?

```ts
readonly providerMetadata?: Record<string, unknown>;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L47)

Provider-specific raw metadata.

---

### signers

```ts
readonly signers: readonly ISigner[];
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L29)

Signers participating in this request.

---

### signingRequestId

```ts
readonly signingRequestId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L17)

Provider-specific signing request identifier.

---

### status

```ts
readonly status: SigningRequestStatus;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L20)

Current status of the signing request.

---

### subject

```ts
readonly subject: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L23)

Subject or title of the signing request.

---

### updatedAt

```ts
readonly updatedAt: Date;
```

Defined in: [libs/platform-esigning/src/models/ISigningRequest.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningRequest.ts#L41)

Timestamp when the signing request was last updated.
