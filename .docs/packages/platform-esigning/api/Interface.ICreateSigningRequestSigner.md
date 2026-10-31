---
title: 'Interface: ICreateSigningRequestSigner'
generated: true
editUrl: false
---

# Interface: ICreateSigningRequestSigner

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L60)

A signer to include when creating a signing request.

## Properties

### email

```ts
readonly email: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:62](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L62)

Email address of the signer.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L65)

Display name of the signer.

---

### order

```ts
readonly order: number;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L71)

Routing order determining the signing sequence.

---

### role

```ts
readonly role: SignerRole;
```

Defined in: [libs/platform-esigning/src/models/ICreateSigningRequest.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ICreateSigningRequest.ts#L68)

Role of the signer.
