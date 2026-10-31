---
title: 'Interface: IAuthSubject'
generated: true
editUrl: false
---

# Interface: IAuthSubject

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L7)

Generic authentication subject returned by the [AuthSubjectBase](Class.AuthSubjectBase).
Represents any entity that can authenticate (user, service account, etc.).

## Properties

### email

```ts
readonly email: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L23)

Email address.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L13)

Unique identifier.

---

### isAnonymous

```ts
readonly isAnonymous: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L38)

Whether the account is anonymous.

---

### isVerified

```ts
readonly isVerified: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L33)

Whether the account has been verified (e.g. email confirmation).

---

### mfaEnabled

```ts
readonly mfaEnabled: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L48)

Whether MFA is enabled for this subject.

---

### password

```ts
readonly password: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L28)

Hashed password. `null` for social-only accounts.

---

### roles

```ts
readonly roles: readonly string[];
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L43)

Assigned role strings (e.g. `['user', 'admin']`).

---

### userName

```ts
readonly userName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IAuthSubject.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IAuthSubject.ts#L18)

Login name (user name, email alias, etc.).
