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
