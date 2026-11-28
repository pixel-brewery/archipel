---
title: 'Class: MfaEncryptionService'
generated: true
editUrl: false
---

# Class: MfaEncryptionService

Defined in: [libs/platform-authentication/src/mfa/MfaEncryptionService.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaEncryptionService.ts#L16)

Provides AES-GCM encryption for MFA secrets.

## Constructors

### Constructor

```ts
new MfaEncryptionService(configService): MfaEncryptionService;
```

Defined in: [libs/platform-authentication/src/mfa/MfaEncryptionService.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaEncryptionService.ts#L25)

#### Parameters

| Parameter       | Type            |
| --------------- | --------------- |
| `configService` | `ConfigService` |

#### Returns

`MfaEncryptionService`

## Methods

### decrypt()

```ts
decrypt(payload): string;
```

Defined in: [libs/platform-authentication/src/mfa/MfaEncryptionService.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaEncryptionService.ts#L54)

Decrypts the payload produced by [encrypt](#encrypt).

#### Parameters

| Parameter | Type     | Description                                               |
| --------- | -------- | --------------------------------------------------------- |
| `payload` | `string` | Base64 encoded payload with IV, auth tag, and ciphertext. |

#### Returns

`string`

---

### encrypt()

```ts
encrypt(secret): string;
```

Defined in: [libs/platform-authentication/src/mfa/MfaEncryptionService.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/MfaEncryptionService.ts#L40)

Encrypts the provided secret using AES-256-GCM.

#### Parameters

| Parameter | Type     | Description                  |
| --------- | -------- | ---------------------------- |
| `secret`  | `string` | Plaintext secret to encrypt. |

#### Returns

`string`

Base64 encoded payload containing IV, auth tag, and ciphertext.
