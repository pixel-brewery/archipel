---
title: 'Interface: IMfaSubjectUpdate'
generated: true
editUrl: false
---

# Interface: IMfaSubjectUpdate

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L7)

Data payload for updating MFA state on the underlying entity.
All properties are optional - only the provided ones are applied.

## Properties

### mfaBackupCodes?

```ts
readonly mfaBackupCodes?: string[];
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L12)

---

### mfaChannels?

```ts
readonly mfaChannels?: unknown;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L16)

---

### mfaEnabled?

```ts
readonly mfaEnabled?: boolean;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L10)

---

### mfaPreferredMethod?

```ts
readonly mfaPreferredMethod?: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L13)

---

### mfaSecret?

```ts
readonly mfaSecret?: string | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L11)

---

### mfaUpdatedAt?

```ts
readonly mfaUpdatedAt?: Date;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L15)

---

### mfaVerifiedAt?

```ts
readonly mfaVerifiedAt?: Date | null;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L14)

---

### phoneNumber?

```ts
readonly phoneNumber?: string;
```

Defined in: [libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/contracts/IMfaSubjectUpdate.ts#L17)
