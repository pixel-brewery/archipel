---
title: 'Class: OtpService'
generated: true
editUrl: false
---

# Class: OtpService

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L42)

OTP service implementation backed by otplib v13.

Wraps the otplib standalone functions behind the generic
[IOtpService](Interface.IOtpService) interface so consumers are decoupled from
the library version.

## Implements

- [`IOtpService`](Interface.IOtpService)

## Constructors

### Constructor

```ts
new OtpService(options?): OtpService;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L57)

Initializes a new instance of the `OtpService` class.

#### Parameters

| Parameter  | Type                                   | Description                                                                      |
| ---------- | -------------------------------------- | -------------------------------------------------------------------------------- |
| `options?` | [`IOtpOptions`](Interface.IOtpOptions) | Optional OTP configuration. When omitted, defaults to a tolerance of 30 seconds. |

#### Returns

`OtpService`

## Methods

### generateSecret()

```ts
generateSecret(): string;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L66)

Generates a cryptographically random secret suitable for TOTP.

#### Returns

`string`

The generated secret string.

#### Implementation of

[`IOtpService`](Interface.IOtpService).[`generateSecret`](Interface.IOtpService#generatesecret)

---

### generateUri()

```ts
generateUri(options): string;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L71)

Generates an `otpauth://` URI for QR code enrollment.

#### Parameters

| Parameter | Type                                         | Description                 |
| --------- | -------------------------------------------- | --------------------------- |
| `options` | [`IOtpUriOptions`](Interface.IOtpUriOptions) | The URI generation options. |

#### Returns

`string`

The formatted `otpauth://` URI.

#### Implementation of

[`IOtpService`](Interface.IOtpService).[`generateUri`](Interface.IOtpService#generateuri)

---

### verify()

```ts
verify(token, secret): boolean;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L83)

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

#### Implementation of

[`IOtpService`](Interface.IOtpService).[`verify`](Interface.IOtpService#verify)

---

### verifyHotp()

```ts
verifyHotp(
   token,
   secret,
   counter
): Promise<boolean>;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L96)

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

#### Implementation of

[`IOtpService`](Interface.IOtpService).[`verifyHotp`](Interface.IOtpService#verifyhotp)
