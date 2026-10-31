---
title: 'Variable: TOTP\_EPOCH\_TOLERANCE'
generated: true
editUrl: false
---

# Variable: TOTP\_EPOCH\_TOLERANCE

```ts
const TOTP_EPOCH_TOLERANCE: 30 = 30;
```

Defined in: [libs/platform-cryptography/src/otp/OtpService.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-cryptography/src/otp/OtpService.ts#L30)

Default TOTP verification tolerance expressed in **seconds** (otplib v13 `epochTolerance`).

Each time step equals 30 seconds by default (RFC 6238).

| `epochTolerance` | Accepted range    |
| ---------------- | ----------------- |
| 0                | current step only |
| 30               | ±1 step (±30 s)   |
| 60               | ±2 steps (±60 s)  |
| 90               | ±3 steps (±90 s)  |
