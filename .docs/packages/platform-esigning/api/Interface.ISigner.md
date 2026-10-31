---
title: 'Interface: ISigner'
generated: true
editUrl: false
---

# Interface: ISigner

Defined in: [libs/platform-esigning/src/models/ISigner.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L13)

Normalized representation of a signer participating in a signing request.

## Properties

### email

```ts
readonly email: string;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L18)

Email address of the signer.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L21)

Display name of the signer.

---

### order

```ts
readonly order: number;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L30)

Routing order determining the signing sequence.

---

### role

```ts
readonly role: SignerRole;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L24)

Role of the signer in the signing process.

---

### signerId

```ts
readonly signerId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L15)

Provider-specific signer identifier.

---

### status

```ts
readonly status: SignerStatus;
```

Defined in: [libs/platform-esigning/src/models/ISigner.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigner.ts#L27)

Current status of this signer.
