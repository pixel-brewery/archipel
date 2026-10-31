---
title: 'Interface: IMfaSubject'
generated: true
editUrl: false
---

# Interface: IMfaSubject

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L7)

Represents an MFA-enabled subject. Contains the data the MFA subsystem
needs to read and write MFA state on the underlying user-like entity.

## Properties

### email

```ts
readonly email: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L18)

Email address, used by the email OTP channel.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L13)

Unique identifier.

---

### mfaBackupCodes

```ts
readonly mfaBackupCodes: readonly string[];
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L38)

Hashed backup codes.

---

### mfaChannels

```ts
readonly mfaChannels: unknown;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L53)

Serialized per-channel MFA state (JSON object).

---

### mfaEnabled

```ts
readonly mfaEnabled: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L28)

Whether MFA is currently enabled.

---

### mfaPreferredMethod

```ts
readonly mfaPreferredMethod: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L43)

Preferred MFA method.

---

### mfaSecret

```ts
readonly mfaSecret: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L33)

Legacy TOTP secret (plain text). Used for migration to channel-based state.

---

### mfaVerifiedAt

```ts
readonly mfaVerifiedAt: Date | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L48)

Last time MFA was verified.

---

### phoneNumber

```ts
readonly phoneNumber: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L58)

Phone number, used by the SMS channel.

---

### userName

```ts
readonly userName: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubject.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubject.ts#L23)

User name, used as TOTP account label.
