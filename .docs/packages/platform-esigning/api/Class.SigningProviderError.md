---
title: 'Class: SigningProviderError'
generated: true
editUrl: false
---

# Class: SigningProviderError

Defined in: [libs/platform-esigning/src/errors/SigningProviderError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningProviderError.ts#L12)

Thrown when a provider-level operation fails.

## Extends

- [`EsigningError`](Class.EsigningError)

## Constructors

### Constructor

```ts
new SigningProviderError(
   providerId,
   message,
   cause?
): SigningProviderError;
```

Defined in: [libs/platform-esigning/src/errors/SigningProviderError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningProviderError.ts#L22)

#### Parameters

| Parameter    | Type      |
| ------------ | --------- |
| `providerId` | `string`  |
| `message`    | `string`  |
| `cause?`     | `unknown` |

#### Returns

`SigningProviderError`

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

### providerId

#### Get Signature

```ts
get providerId(): string;
```

Defined in: [libs/platform-esigning/src/errors/SigningProviderError.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningProviderError.ts#L34)

Identifier of the provider that failed.

##### Returns

`string`

---

### rootCause

#### Get Signature

```ts
get rootCause(): unknown;
```

Defined in: [libs/platform-esigning/src/errors/SigningProviderError.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/errors/SigningProviderError.ts#L39)

Original error or cause, if available.

##### Returns

`unknown`
