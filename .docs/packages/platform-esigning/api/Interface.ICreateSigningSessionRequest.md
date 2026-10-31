---
title: 'Interface: ICreateSigningSessionRequest'
generated: true
editUrl: false
---

# Interface: ICreateSigningSessionRequest

Defined in: [libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts#L6)

Input for creating a signing session (signing link) for a specific signer.

## Properties

### returnUrl?

```ts
readonly returnUrl?: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts#L14)

URL to redirect the signer to after completing the signing.

---

### signerId

```ts
readonly signerId: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts#L11)

Identifier of the signer to generate the session for.

---

### signingRequestId

```ts
readonly signingRequestId: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningSessionRequest.ts#L8)

Identifier of the signing request.
