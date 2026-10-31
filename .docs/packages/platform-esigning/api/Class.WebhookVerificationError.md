---
title: 'Class: WebhookVerificationError'
generated: true
editUrl: false
---

# Class: WebhookVerificationError

Defined in: [libs/platform-esigning/src/errors/WebhookVerificationError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/WebhookVerificationError.ts#L12)

Thrown when a webhook signature verification fails.

## Extends

- [`EsigningError`](Class.EsigningError)

## Constructors

### Constructor

```ts
new WebhookVerificationError(message?): WebhookVerificationError;
```

Defined in: [libs/platform-esigning/src/errors/WebhookVerificationError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/WebhookVerificationError.ts#L15)

#### Parameters

| Parameter  | Type     |
| ---------- | -------- |
| `message?` | `string` |

#### Returns

`WebhookVerificationError`

#### Overrides

[`EsigningError`](Class.EsigningError).[`constructor`](Class.EsigningError#constructor)

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

#### Inherited from

[`EsigningError`](Class.EsigningError).[`code`](Class.EsigningError#code)
