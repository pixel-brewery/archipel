---
title: 'Interface: ISigningSession'
generated: true
editUrl: false
---

# Interface: ISigningSession

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L6)

Normalized representation of a signing session or signing link.

## Properties

### expiresAt

```ts
readonly expiresAt: Date;
```

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L20)

Timestamp when the session expires.

---

### sessionId

```ts
readonly sessionId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L8)

Provider-specific session identifier.

---

### signerId

```ts
readonly signerId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L14)

Signer this session was created for.

---

### signingRequestId

```ts
readonly signingRequestId: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L11)

Signing request this session belongs to.

---

### signingUrl

```ts
readonly signingUrl: string;
```

Defined in: [libs/platform-esigning/src/models/ISigningSession.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/models/ISigningSession.ts#L17)

URL the signer should be directed to for signing.
