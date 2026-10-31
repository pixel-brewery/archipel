---
title: 'Class: CryptoService'
generated: true
editUrl: false
---

# Class: CryptoService

Defined in: [libs/platform-cryptography/src/CryptoService.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/CryptoService.ts#L16)

The `CryptoService` class.
Represents the service that provides cryptographic operations.

## Constructors

### Constructor

```ts
new CryptoService(): CryptoService;
```

Defined in: [libs/platform-cryptography/src/CryptoService.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/CryptoService.ts#L22)

Initializes a new instance of the `CryptoService` class.

#### Returns

`CryptoService`

## Methods

### getRandomGuid()

```ts
getRandomGuid(prefix): string;
```

Defined in: [libs/platform-cryptography/src/CryptoService.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/CryptoService.ts#L37)

Generates a random GUID prefixed with the given string.

#### Parameters

| Parameter | Type     | Description                                  |
| --------- | -------- | -------------------------------------------- |
| `prefix`  | `string` | The prefix to prepend to the generated UUID. |

#### Returns

`string`

The prefixed UUID string.
