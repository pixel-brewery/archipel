---
title: 'Class: EsigningError'
generated: true
editUrl: false
---

# Class: EsigningError

Defined in: [libs/platform-esigning/src/errors/EsigningError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/EsigningError.ts#L6)

Base error for all e-signing related failures.

## Extends

- `Error`

## Extended by

- [`SigningProviderError`](Class.SigningProviderError)
- [`SigningRequestNotFoundError`](Class.SigningRequestNotFoundError)
- [`WebhookVerificationError`](Class.WebhookVerificationError)

## Constructors

### Constructor

```ts
new EsigningError(message, code): EsigningError;
```

Defined in: [libs/platform-esigning/src/errors/EsigningError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/EsigningError.ts#L15)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |
| `code`    | `string` |

#### Returns

`EsigningError`

#### Overrides

`Error.constructor`

## Accessors

### code

#### Get Signature

```ts
get code(): string;
```

Defined in: [libs/platform-esigning/src/errors/EsigningError.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/EsigningError.ts#L26)

Machine-readable error code.

##### Returns

`string`
