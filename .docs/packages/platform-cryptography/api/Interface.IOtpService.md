---
title: 'Interface: IOtpService'
generated: true
editUrl: false
---

# Interface: IOtpService

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L38)

Abstraction over OTP (One-Time Password) operations.

Decouples consumers from any specific OTP library, making it easy
to swap implementations (e.g. upgrading from otplib v12 to v13)
without changing consumer code.

## Methods

### generateSecret()

```ts
generateSecret(): string;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L45)

Generates a cryptographically random secret suitable for TOTP.

#### Returns

`string`

The generated secret string.

---

### generateUri()

```ts
generateUri(options): string;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L54)

Generates an `otpauth://` URI for QR code enrollment.

#### Parameters

| Parameter | Type                                         | Description                 |
| --------- | -------------------------------------------- | --------------------------- |
| `options` | [`IOtpUriOptions`](Interface.IOtpUriOptions) | The URI generation options. |

#### Returns

`string`

The formatted `otpauth://` URI.

---

### verify()

```ts
verify(token, secret): boolean;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L67)

Verifies a TOTP token against the given secret.

The underlying comparison is **constant-time** (handled by the
otplib implementation), preventing timing-based side-channel attacks.

#### Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `token`   | `string` | The one-time password to verify. |
| `secret`  | `string` | The shared secret.               |

#### Returns

`boolean`

`true` if the token is valid within the configured tolerance window.

---

### verifyHotp()

```ts
verifyHotp(
   token,
   secret,
   counter
): Promise<boolean>;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L91)

Verifies an HOTP (counter-based) token against the given secret and counter.

#### Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `token`   | `string` | The one-time password to verify. |
| `secret`  | `string` | The shared secret.               |
| `counter` | `number` | The expected HOTP counter value. |

#### Returns

`Promise`\<`boolean`\>

`true` if the token is valid for the given counter.

---

### verifyTimeStep()?

```ts
verifyTimeStep ? (token, secret) : number | null;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L80)

Verifies a TOTP and returns its exact RFC 6238 counter for atomic replay prevention.

This additive optional capability preserves existing providers. A consumer requiring replay protection
must reject providers that do not implement it; a boolean verification is insufficient for that contract.

#### Parameters

| Parameter | Type     | Description                      |
| --------- | -------- | -------------------------------- |
| `token`   | `string` | The one-time password to verify. |
| `secret`  | `string` | The shared secret.               |

#### Returns

`number` \| `null`

The matched counter or `null` for an invalid token.
