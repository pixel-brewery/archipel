---
title: 'Class: InvalidOtpError'
generated: true
editUrl: false
---

# Class: InvalidOtpError

Defined in: [libs/platform-cryptography/src/errors/InvalidOtpError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/InvalidOtpError.ts#L12)

Thrown when an OTP token fails verification.

## Extends

- [`CryptographyErrorBase`](Class.CryptographyErrorBase)

## Constructors

### Constructor

```ts
new InvalidOtpError(message?): InvalidOtpError;
```

Defined in: [libs/platform-cryptography/src/errors/InvalidOtpError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/InvalidOtpError.ts#L15)

#### Parameters

| Parameter  | Type     | Default value                                     |
| ---------- | -------- | ------------------------------------------------- |
| `message?` | `string` | `'The provided OTP token is invalid or expired.'` |

#### Returns

`InvalidOtpError`

#### Overrides

[`CryptographyErrorBase`](Class.CryptographyErrorBase).[`constructor`](Class.CryptographyErrorBase#constructor)

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts#L10)

#### Inherited from

[`CryptographyErrorBase`](Class.CryptographyErrorBase).[`code`](Class.CryptographyErrorBase#code)
