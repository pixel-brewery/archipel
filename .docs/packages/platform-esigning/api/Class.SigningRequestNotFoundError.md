---
title: 'Class: SigningRequestNotFoundError'
generated: true
editUrl: false
---

# Class: SigningRequestNotFoundError

Defined in: [libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts#L12)

Thrown when a signing request cannot be found by the provider.

## Extends

- [`EsigningError`](Class.EsigningError)

## Constructors

### Constructor

```ts
new SigningRequestNotFoundError(signingRequestId): SigningRequestNotFoundError;
```

Defined in: [libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts#L21)

#### Parameters

| Parameter          | Type     |
| ------------------ | -------- |
| `signingRequestId` | `string` |

#### Returns

`SigningRequestNotFoundError`

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

---

### signingRequestId

#### Get Signature

```ts
get signingRequestId(): string;
```

Defined in: [libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningRequestNotFoundError.ts#L32)

The identifier of the signing request that was not found.

##### Returns

`string`
