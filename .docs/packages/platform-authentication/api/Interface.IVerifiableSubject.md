---
title: 'Interface: IVerifiableSubject'
generated: true
editUrl: false
---

# Interface: IVerifiableSubject

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L7)

Represents a verifiable authentication subject.
Used by the [VerificationService](Class.VerificationService) to verify email / PIN.

## Properties

### email

```ts
readonly email: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L18)

Email address.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L13)

Unique identifier.

---

### isVerified

```ts
readonly isVerified: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L28)

Whether the account has already been verified.

---

### userName

```ts
readonly userName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L23)

User / login name.

---

### verificationToken

```ts
readonly verificationToken: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IVerifiableSubject.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IVerifiableSubject.ts#L33)

Current verification token stored on the entity.
