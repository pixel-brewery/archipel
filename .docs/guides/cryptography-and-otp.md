---
title: Cryptography & OTP
description: Hash passwords with bcrypt, generate prefixed UUIDs, and implement TOTP-based multi-factor authentication with QR code enrollment.
order: 17
---

# Cryptography & OTP

This guide covers cryptographic utilities provided by `platform-cryptography`: password hashing with bcrypt, prefixed UUID generation, and TOTP-based one-time password flows for multi-factor authentication.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-cryptography
```

---

## Password Hashing with Bcrypt

`BcryptService` wraps the `bcrypt` library to hash and verify passwords securely. It generates a unique salt per hash automatically.

### Hashing a Password

```typescript
import { Injectable } from '@nestjs/common';
import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';

@Injectable()
export class UserService {
    private readonly _bcrypt: BcryptService;

    constructor(bcrypt: BcryptService) {
        this._bcrypt = bcrypt;
    }

    public async createUser(email: string, password: string): Promise<void> {
        const hashedPassword = await this._bcrypt.hash(password);
        // Store hashedPassword in the database — never the plain password
        await this._userRepository.create({ email, password: hashedPassword });
    }
}
```

### Verifying a Password

```typescript
public async authenticate(email: string, password: string): Promise<boolean> {
  const user = await this._userRepository.findByEmail(email);
  if (!user) {
    return false;
  }

  return this._bcrypt.compare(password, user.password);
}
```

`compare()` returns `true` if the plain-text password matches the stored hash.

---

## Generating Prefixed UUIDs

`CryptoService` generates UUIDs with a configurable prefix. This is useful for creating human-readable identifiers that indicate their resource type.

```typescript
import { Injectable } from '@nestjs/common';
import { CryptoService } from '@pixel-brewery/archipel-platform-cryptography';

@Injectable()
export class OrderService {
    private readonly _crypto: CryptoService;

    constructor(crypto: CryptoService) {
        this._crypto = crypto;
    }

    public createOrderId(): string {
        return this._crypto.getRandomGuid('ord');
        // Example: "ord-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    }
}
```

The prefix is required and must be a non-empty string. Use short, descriptive prefixes that represent the resource type:

| Resource     | Prefix | Example                                    |
| ------------ | ------ | ------------------------------------------ |
| Order        | `ord`  | `ord-550e8400-e29b-41d4-a716-446655440000` |
| Invoice      | `inv`  | `inv-6ba7b810-9dad-11d1-80b4-00c04fd430c8` |
| Subscription | `sub`  | `sub-f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| User         | `usr`  | `usr-7c9e6679-7425-40de-944b-e07fc1f90ae7` |

---

## TOTP Multi-Factor Authentication

`OtpService` implements TOTP (Time-Based One-Time Password) as defined in [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238). It supports QR code enrollment and token verification.

### Injecting OtpService

`OtpService` is provided behind the `OTP_SERVICE_TOKEN` injection token so consumers depend on the `IOtpService` interface:

```typescript
import { Module } from '@nestjs/common';
import { OtpService, OTP_SERVICE_TOKEN } from '@pixel-brewery/archipel-platform-cryptography/otp';

@Module({
    providers: [
        {
            provide: OTP_SERVICE_TOKEN,
            useClass: OtpService,
        },
    ],
    exports: [OTP_SERVICE_TOKEN],
})
export class SecurityModule {}
```

### Enrolling a User

Generate a secret and a QR code URI for the user's authenticator app:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { OTP_SERVICE_TOKEN, type IOtpService } from '@pixel-brewery/archipel-platform-cryptography/otp';

@Injectable()
export class MfaService {
    private readonly _otp: IOtpService;

    constructor(@Inject(OTP_SERVICE_TOKEN) otp: IOtpService) {
        this._otp = otp;
    }

    public async enroll(userId: string, email: string): Promise<{ secret: string; uri: string }> {
        const secret = this._otp.generateSecret();
        const uri = this._otp.generateUri({
            issuer: 'MyApp',
            label: email,
            secret: secret,
        });

        // Store the secret securely alongside the user record
        await this._userRepository.updateMfaSecret(userId, secret);

        return { secret, uri };
        // The URI can be encoded as a QR code for scanning with Google Authenticator, Authy, etc.
    }
}
```

### Verifying a Token

Verify a 6-digit TOTP code entered by the user:

```typescript
public verifyToken(token: string, secret: string): boolean {
  return this._otp.verify(token, secret);
}
```

Verification uses a configurable tolerance window (`TOTP_EPOCH_TOLERANCE`). The default tolerance is **30 seconds** (±1 time step), meaning the current code and the immediately preceding/following codes are accepted. This compensates for minor clock drift between the server and the user's device.

### Tolerance Configuration

The `TOTP_EPOCH_TOLERANCE` constant controls the verification window:

| `TOTP_EPOCH_TOLERANCE` | Accepted range    |
| ---------------------- | ----------------- |
| `0`                    | Current step only |
| `30`                   | ±1 step (±30 s)   |
| `60`                   | ±2 steps (±60 s)  |
| `90`                   | ±3 steps (±90 s)  |

The default value is `30` (±1 step).

---

## Combining Services

A typical MFA login flow uses all three services:

```typescript
@Injectable()
export class AuthService {
    private readonly _bcrypt: BcryptService;
    private readonly _otp: IOtpService;
    private readonly _crypto: CryptoService;

    constructor(bcrypt: BcryptService, @Inject(OTP_SERVICE_TOKEN) otp: IOtpService, crypto: CryptoService) {
        this._bcrypt = bcrypt;
        this._otp = otp;
        this._crypto = crypto;
    }

    public async login(email: string, password: string, totpCode?: string): Promise<IAuthResult> {
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }

        // Step 1: Verify password
        const validPassword = await this._bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new UnauthorizedException();
        }

        // Step 2: Verify TOTP (if MFA is enabled)
        if (user.mfaEnabled) {
            if (!totpCode) {
                return { status: 'mfa-required' };
            }
            const validTotp = this._otp.verify(totpCode, user.mfaSecret);
            if (!validTotp) {
                throw new UnauthorizedException('Invalid MFA code');
            }
        }

        // Step 3: Issue session
        const sessionId = this._crypto.getRandomGuid('ses');
        return { status: 'authenticated', sessionId };
    }
}
```

---

## Error Handling

`CryptoService` throws a `CryptoValidationError` for invalid inputs such as empty UUID prefixes:

```typescript
import { CryptoValidationError } from '@pixel-brewery/archipel-platform-cryptography';

try {
    crypto.getRandomGuid('');
} catch (error) {
    if (error instanceof CryptoValidationError) {
        // error.code → 'CRYPTO_VALIDATION'
    }
}
```

---

## Security Best Practices

| Practice                            | Why                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| Never store plain-text passwords    | Always use `BcryptService.hash()` before persisting       |
| Store MFA secrets encrypted at rest | The TOTP secret is equivalent to a password               |
| Use rate limiting on verification   | Prevents brute-force attacks on 6-digit TOTP codes        |
| Generate backup codes on enrollment | Users may lose access to their authenticator device       |
| Log MFA events, not secrets         | Never log secrets, tokens, or plain-text passwords        |
| Use `OTP_SERVICE_TOKEN` for DI      | Depend on `IOtpService` interface, not the concrete class |
