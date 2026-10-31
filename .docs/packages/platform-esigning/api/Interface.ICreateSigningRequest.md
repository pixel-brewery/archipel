---
title: 'Interface: ICreateSigningRequest'
generated: true
editUrl: false
---

# Interface: ICreateSigningRequest

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L13)

Input for creating a new signing request.

## Properties

### documents

```ts
readonly documents: readonly ICreateSigningRequestDocument[];
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L21)

Documents to include in the signing request.

---

### expiresInHours?

```ts
readonly expiresInHours?: number;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L30)

Expiration duration in hours, if applicable.

---

### fields?

```ts
readonly fields?: readonly Omit<ISigningField, "fieldId" | "value">[];
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L27)

Fields to place on the documents.

---

### message?

```ts
readonly message?: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L18)

Optional message for the signers.

---

### providerOptions?

```ts
readonly providerOptions?: Record<string, unknown>;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L33)

Provider-specific extra options.

---

### signers

```ts
readonly signers: readonly ICreateSigningRequestSigner[];
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L24)

Signers to participate in the signing request.

---

### subject

```ts
readonly subject: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L15)

Subject or title of the signing request.
