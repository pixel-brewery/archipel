---
title: 'Interface: IBcryptOptions'
generated: true
editUrl: false
---

# Interface: IBcryptOptions

Defined in: [libs/platform-cryptography/src/IBcryptOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/IBcryptOptions.ts#L6)

Configuration options for [BcryptService](Class.BcryptService).

## Properties

### pepper?

```ts
readonly pepper?: string;
```

Defined in: [libs/platform-cryptography/src/IBcryptOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/IBcryptOptions.ts#L24)

Optional server-side pepper used as an HMAC key. When provided,
every password is HMAC-SHA-256'd with this pepper before bcrypt
hashing, adding a server-side secret layer and normalizing the
password length to 64 hex characters (well within the 72-byte limit).

---

### rounds?

```ts
readonly rounds?: number;
```

Defined in: [libs/platform-cryptography/src/IBcryptOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/IBcryptOptions.ts#L14)

Number of bcrypt salt rounds. Must be ≥ 12 (OWASP recommendation).
Values below the minimum are clamped to 12.

#### Default Value

```ts
12
@public
```
