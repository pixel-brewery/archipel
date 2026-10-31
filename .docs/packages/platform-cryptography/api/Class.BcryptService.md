---
title: 'Class: BcryptService'
generated: true
editUrl: false
---

# Class: BcryptService

Defined in: [libs/platform-cryptography/src/BcryptService.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/BcryptService.ts#L34)

The `BcryptService` class.
Provides bcrypt hashing and comparison with configurable salt rounds,
optional pepper (HMAC pre-hash), and SHA-256 pre-hash for passwords
exceeding bcrypt's 72-byte input limit.

## Constructors

### Constructor

```ts
new BcryptService(options?): BcryptService;
```

Defined in: [libs/platform-cryptography/src/BcryptService.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/BcryptService.ts#L50)

Initializes a new instance of the `BcryptService` class.

#### Parameters

| Parameter  | Type                                         | Description                                                                       |
| ---------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| `options?` | [`IBcryptOptions`](Interface.IBcryptOptions) | Optional bcrypt configuration. When omitted, defaults to 12 rounds and no pepper. |

#### Returns

`BcryptService`

## Methods

### compare()

```ts
compare(data, encrypted): Promise<boolean>;
```

Defined in: [libs/platform-cryptography/src/BcryptService.ts:92](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/BcryptService.ts#L92)

Compares the given data with the encrypted data.

Uses bcrypt's native `compare()` function which performs a
**constant-time** comparison internally, preventing timing-based
side-channel attacks. The same password preparation (pepper / SHA-256
pre-hash) is applied to the input before comparison so behaves
symmetrically with [BcryptService.hash](#hash).

#### Parameters

| Parameter   | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `data`      | `string` | The data to be compared.           |
| `encrypted` | `string` | The encrypted data to be compared. |

#### Returns

`Promise`\<`boolean`\>

`true` if the data matches the encrypted hash; otherwise `false`.

---

### hash()

```ts
hash(data): Promise<string>;
```

Defined in: [libs/platform-cryptography/src/BcryptService.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/BcryptService.ts#L71)

Hashes the given data using bcrypt with a generated salt.

When a pepper is configured, the input is HMAC-SHA-256'd first,
which both adds a server-side secret and normalizes the length.
When no pepper is set but the input exceeds 72 bytes, a SHA-256
pre-hash is applied to prevent silent bcrypt truncation.

#### Parameters

| Parameter | Type     | Description            |
| --------- | -------- | ---------------------- |
| `data`    | `string` | The data to be hashed. |

#### Returns

`Promise`\<`string`\>

The bcrypt hash string.
