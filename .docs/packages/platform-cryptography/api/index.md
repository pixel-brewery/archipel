---
title: '@pixel-brewery/archipel-platform-cryptography'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-cryptography

## Classes

| Class                                                | Description                                                                                                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [BcryptService](Class.BcryptService)                 | The `BcryptService` class. Provides bcrypt hashing and comparison with configurable salt rounds, optional pepper (HMAC pre-hash), and SHA-256 pre-hash for passwords exceeding bcrypt's 72-byte input limit. |
| [CryptographyErrorBase](Class.CryptographyErrorBase) | Base class for cryptography-related domain errors.                                                                                                                                                           |
| [CryptoService](Class.CryptoService)                 | The `CryptoService` class. Represents the service that provides cryptographic operations.                                                                                                                    |
| [InvalidOtpError](Class.InvalidOtpError)             | Thrown when an OTP token fails verification.                                                                                                                                                                 |
| [OtpService](Class.OtpService)                       | OTP service implementation backed by otplib v13.                                                                                                                                                             |
| [WeakPasswordError](Class.WeakPasswordError)         | Thrown when a password does not meet the minimum strength requirements.                                                                                                                                      |

## Interfaces

| Interface                                  | Description                                                     |
| ------------------------------------------ | --------------------------------------------------------------- |
| [IBcryptOptions](Interface.IBcryptOptions) | Configuration options for [BcryptService](Class.BcryptService). |
| [IOtpOptions](Interface.IOtpOptions)       | Configuration options for [OtpService](Class.OtpService).       |
| [IOtpService](Interface.IOtpService)       | Abstraction over OTP (One-Time Password) operations.            |
| [IOtpUriOptions](Interface.IOtpUriOptions) | Options for generating an OTP authentication URI (otpauth://).  |

## Variables

| Variable                                                           | Description                                                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [BCRYPT\_OPTIONS](Variable.BCRYPT_OPTIONS)                         | Injection token for bcrypt options.                                                         |
| [MAX\_BCRYPT\_PASSWORD\_BYTES](Variable.MAX_BCRYPT_PASSWORD_BYTES) | Maximum password byte length that bcrypt processes without truncation.                      |
| [MIN\_BCRYPT\_ROUNDS](Variable.MIN_BCRYPT_ROUNDS)                  | Minimum number of bcrypt salt rounds enforced by the service (OWASP ≥ 12).                  |
| [OTP\_OPTIONS](Variable.OTP_OPTIONS)                               | Injection token for OTP service options.                                                    |
| [OTP\_SERVICE\_TOKEN](Variable.OTP_SERVICE_TOKEN)                  | Injection token for the OTP service abstraction.                                            |
| [TOTP\_EPOCH\_TOLERANCE](Variable.TOTP_EPOCH_TOLERANCE)            | Default TOTP verification tolerance expressed in **seconds** (otplib v13 `epochTolerance`). |
