---
title: 'Interface: IOtpUriOptions'
generated: true
editUrl: false
---

# Interface: IOtpUriOptions

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L6)

Options for generating an OTP authentication URI (otpauth://).

## Properties

### issuer

```ts
readonly issuer: string;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L12)

The issuer name displayed in the authenticator app.

---

### label

```ts
readonly label: string;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L19)

The account label (e.g. email or username) shown in the authenticator app.

---

### secret

```ts
readonly secret: string;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpService.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpService.ts#L26)

The shared secret used for TOTP generation.
