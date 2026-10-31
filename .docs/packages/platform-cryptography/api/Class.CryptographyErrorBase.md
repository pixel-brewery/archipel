---
title: 'Abstract Class: CryptographyErrorBase'
generated: true
editUrl: false
---

# Abstract Class: CryptographyErrorBase

Defined in: [libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts#L7)

Base class for cryptography-related domain errors.

## Extends

- `Error`

## Extended by

- [`InvalidOtpError`](Class.InvalidOtpError)
- [`WeakPasswordError`](Class.WeakPasswordError)

## Constructors

### Constructor

```ts
protected new CryptographyErrorBase(message, code): CryptographyErrorBase;
```

Defined in: [libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts#L16)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |
| `code`    | `string` |

#### Returns

`CryptographyErrorBase`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: string;
```

Defined in: [libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/abstracts/CryptographyErrorBase.ts#L10)
