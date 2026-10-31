---
title: 'Interface: IOtpOptions'
generated: true
editUrl: false
---

# Interface: IOtpOptions

Defined in: [libs/platform-cryptography/src/otp/IOtpOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpOptions.ts#L6)

Configuration options for [OtpService](Class.OtpService).

## Properties

### epochTolerance?

```ts
readonly epochTolerance?: number;
```

Defined in: [libs/platform-cryptography/src/otp/IOtpOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/IOtpOptions.ts#L15)

TOTP verification tolerance expressed in **seconds**.
Determines how many time steps before/after the current moment
are accepted during TOTP verification.

#### Default Value

```ts
30
@public
```
