# @pixel-brewery/archipel-platform-cryptography

Cryptographic utilities for NestJS — bcrypt hashing, GUID generation, and TOTP OTP support.

## Features

- **Bcrypt hashing** — `BcryptService` for password hashing and comparison
- **GUID generation** — `CryptoService` for prefixed random identifiers
- **OTP/TOTP support** — `OtpService` for secret generation, URI creation, and token verification
- **Input validation** — Enforces minimum bcrypt rounds and password byte limits

## Quick Start

```typescript
import { BcryptService, CryptoService } from '@pixel-brewery/archipel-platform-cryptography';

const bcrypt = new BcryptService();
const hash = await bcrypt.hash('password');
const isValid = await bcrypt.compare('password', hash);

const crypto = new CryptoService();
const guid = crypto.getRandomGuid('user');
```

## Import Options

```typescript
// Main import
import { BcryptService, CryptoService } from '@pixel-brewery/archipel-platform-cryptography';

// OTP support (tree-shakable sub-export)
import { OtpService, OTP_SERVICE_TOKEN, OTP_OPTIONS } from '@pixel-brewery/archipel-platform-cryptography/otp';
```

### Verified counters and replay protection

`OtpService.verifyTimeStep(token, secret)` returns the exact matched RFC 6238 time-step counter, or `null` for invalid evidence. It uses the same secret, crypto provider and tolerance configuration as `verify`; a tolerated previous/future code returns its own counter rather than the server's current step. This is an additive optional method on `IOtpService`, so existing custom OTP providers remain source-compatible.

Counter verification alone does not consume a code. A caller requiring one-use authentication must atomically consume the matched counter for the current secret in durable persistence and reject counters less than or equal to the consumed one. The authentication package's optional `MfaReplayPersistenceBase` contract supplies that integration. Providers that do not implement the counter method cannot satisfy that opt-in contract and are rejected rather than silently downgraded.

## Error Handling

| Error Class             | Code                | When Thrown                                  |
| ----------------------- | ------------------- | -------------------------------------------- |
| `CryptoValidationError` | `CRYPTO_VALIDATION` | Invalid input (e.g. empty prefix for UUID)   |
| `WeakPasswordError`     | `WEAK_PASSWORD`     | Password does not meet strength requirements |
| `InvalidOtpError`       | `INVALID_OTP`       | OTP verification failed                      |

## Resource Limits

| Limit              | Value | Description                                |
| ------------------ | ----- | ------------------------------------------ |
| Max password bytes | 72    | Bcrypt truncates passwords beyond 72 bytes |
| Min bcrypt rounds  | 12    | Minimum cost factor for hashing            |

## Peer Dependencies

| Package          | Required | Notes            |
| ---------------- | -------- | ---------------- |
| `@nestjs/common` | Yes      | NestJS core      |
| `bcrypt`         | Yes      | Password hashing |
| `otplib`         | Yes      | OTP/TOTP support |

## Documentation

📖 **Package Docs:** [`.docs/packages/platform-cryptography/index.md`](../../.docs/packages/platform-cryptography/index.md)

## Development

```bash
# Build
yarn nx build platform-cryptography

# Test
yarn nx test platform-cryptography

# Lint
yarn nx lint platform-cryptography
```
