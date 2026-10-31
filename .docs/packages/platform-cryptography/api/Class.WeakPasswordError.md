---
title: 'Class: WeakPasswordError'
generated: true
editUrl: false
---

# Class: WeakPasswordError

Defined in: [libs/platform-cryptography/src/errors/WeakPasswordError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/WeakPasswordError.ts#L12)

Thrown when a password does not meet the minimum strength requirements.

## Extends

- [`CryptographyErrorBase`](Class.CryptographyErrorBase)

## Constructors

### Constructor

```ts
new WeakPasswordError(message?): WeakPasswordError;
```

Defined in: [libs/platform-cryptography/src/errors/WeakPasswordError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/errors/WeakPasswordError.ts#L15)

#### Parameters

| Parameter  | Type     | Default value                                                              |
| ---------- | -------- | -------------------------------------------------------------------------- |
| `message?` | `string` | `'The provided password does not meet the minimum strength requirements.'` |

#### Returns

`WeakPasswordError`

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
