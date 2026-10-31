# @pixel-brewery/archipel-platform-authentication

Authentication and authorization infrastructure for NestJS applications.

## Features

- **JWT authentication** — Access/refresh token issuance and validation
- **Social OAuth** — Google, Microsoft, Apple, and GitHub connectors
- **MFA/TOTP** — Multi-factor authentication with challenge store
- **Anonymous sessions** — Seeded anonymous user support
- **Inactivity checks** — Query persisted session activity against an application-defined cutoff
- **Pluggable abstract bases** — All persistence and enrichment via injectable adapters
- **NestJS guards & decorators** — Ready-made guards for route protection
- **Health checks** — `AuthenticationHealthIndicator` for readiness probes (separate `/health` subpath)

## ⚠️ Environment Variables

| Variable                       | Required | Default | Description                               |
| ------------------------------ | -------- | ------- | ----------------------------------------- |
| `AUTH_JWT_SECRET`              | yes      | -       | JWT signing secret                        |
| `AUTH_JWT_EXPIRES_IN`          | yes      | -       | Access token expiry (e.g. `15m`)          |
| `AUTH_VERIFY_JWT_EXPIRES_IN`   | yes      | -       | Verification token expiry                 |
| `AUTH_GOOGLE_CLIENT_ID`        | yes      | -       | Google OAuth client ID                    |
| `AUTH_GOOGLE_CLIENT_SECRET`    | yes      | -       | Google OAuth client secret                |
| `AUTH_MICROSOFT_CLIENT_ID`     | yes      | -       | Microsoft OAuth client ID                 |
| `AUTH_MICROSOFT_CLIENT_SECRET` | yes      | -       | Microsoft OAuth client secret             |
| `AUTH_APPLE_PRIVATE_KEY`       | yes      | -       | Apple Sign-In private key (PEM)           |
| `AUTH_APPLE_CLIENT_ID`         | yes      | -       | Apple Sign-In client (service) ID         |
| `AUTH_APPLE_TEAM_ID`           | yes      | -       | Apple developer team ID                   |
| `AUTH_APPLE_KEY_ID`            | yes      | -       | Apple Sign-In key ID                      |
| `AUTH_GITHUB_CLIENT_ID`        | yes      | -       | GitHub OAuth client ID                    |
| `AUTH_GITHUB_CLIENT_SECRET`    | yes      | -       | GitHub OAuth client secret                |
| `SEED_ANONYMOUS_USERNAME`      | yes      | -       | Username for the seeded anonymous account |

For the full list (including MFA/OAuth callback defaults), see [`../../ENVIRONMENT_VARIABLES.md`](../../ENVIRONMENT_VARIABLES.md).

## Quick Start

```typescript
import { AuthModule } from '@pixel-brewery/archipel-platform-authentication';

@Module({
    imports: [
        AuthModule.register({
            authSubject: PrismaAuthSubjectAdapter,
            mfaSubject: PrismaMfaSubjectAdapter,
            sessionPersistence: PrismaSessionAdapter,
            verificationSubject: PrismaVerificationAdapter,
            challengeStore: RedisChallengeStore, // optional — defaults to in-memory
            socialAuth: PrismaSocialAuthAdapter, // optional — enables OAuth
            tokenEnricher: AppTokenEnricherAdapter, // optional — enriches JWT claims
        }),
    ],
})
export class AppModule {}
```

## Import Options

```typescript
// Main import (module, guards, abstract bases)
import { AuthModule, AuthSubjectBase, SessionPersistenceBase } from '@pixel-brewery/archipel-platform-authentication';

// Social auth connectors (tree-shakable sub-exports)
import { GoogleConnector } from '@pixel-brewery/archipel-platform-authentication/connectors/google';
import { MicrosoftConnector } from '@pixel-brewery/archipel-platform-authentication/connectors/microsoft';
import { AppleConnector } from '@pixel-brewery/archipel-platform-authentication/connectors/apple';
import { GithubConnector } from '@pixel-brewery/archipel-platform-authentication/connectors/github';

// MFA/TOTP
import { TotpService } from '@pixel-brewery/archipel-platform-authentication/mfa/totp';

// Health indicator (optional)
import { AuthenticationHealthIndicator } from '@pixel-brewery/archipel-platform-authentication/health';
```

## Abstract Bases

| Abstract Base             | Required | Description                                       |
| ------------------------- | -------- | ------------------------------------------------- |
| `AuthSubjectBase`         | Yes      | User lookup for JWT, Local, and Anonymous         |
| `MfaSubjectBase`          | Yes      | MFA state persistence                             |
| `SessionPersistenceBase`  | Yes      | Session storage and invalidation                  |
| `VerificationSubjectBase` | Yes      | Email/PIN verification lifecycle                  |
| `ChallengeStoreBase`      | No       | MFA challenge state. Defaults to in-memory store. |
| `SocialAuthBase`          | No       | OAuth user creation/linking                       |
| `TokenEnricherBase`       | No       | Custom JWT claim injection                        |

## Error Handling

| Error Class                    | When Thrown                                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `InvalidMfaCodeError`          | `MfaService.verifySetup` received a code that does not confirm the setup: `400` with the code `INVALID_MFA_CODE`                                      |
| `MfaChannelNotEnabledError`    | The email, SMS, or push channel was asked for a sign-in challenge the person has not enabled: `401` with the code `MFA_CHANNEL_NOT_ENABLED`           |
| `MfaCodeExpiredError`          | The email, SMS, or push channel verified a sign-in code or approval after it expired: `401` with the code `MFA_CODE_EXPIRED`                          |
| `MfaCodeNotIssuedError`        | The email, SMS, or push channel verified a sign-in code or approval although none was issued: `401` with the code `MFA_CODE_NOT_ISSUED`               |
| `MfaCodeRecentlySentError`     | The email, SMS, or push channel was asked for a new code or approval before the resend interval passed: `400` with the code `MFA_CODE_RECENTLY_SENT`  |
| `MfaCodeRequiredError`         | `MfaService.verifySetup` received an empty or blank code: `400` with the code `MFA_CODE_REQUIRED`                                                     |
| `MfaEmailRequiredError`        | The email channel has no email address to send codes to: `400` with the code `MFA_EMAIL_REQUIRED`                                                     |
| `MfaMethodAlreadyEnabledError` | `MfaService.initSetup` was called for a method that is already enabled: `400` with the code `MFA_METHOD_ALREADY_ENABLED`                              |
| `MfaMethodNotEnabledError`     | `MfaService.setPreferredMethod` received a method that is not enabled: `400` with the code `MFA_METHOD_NOT_ENABLED`                                   |
| `MfaNotEnabledError`           | `MfaService.verifyChallenge` or `MfaService.regenerateBackupCodes` was called for a person without enabled MFA: `400` with the code `MFA_NOT_ENABLED` |
| `MfaPhoneNumberRequiredError`  | The SMS channel has no phone number to send codes to: `400` with the code `MFA_PHONE_NUMBER_REQUIRED`                                                 |
| `MfaSetupExpiredError`         | The email, SMS, or push channel verified a setup code or approval after it expired: `400` with the code `MFA_SETUP_EXPIRED`                           |
| `MfaSetupNotInitializedError`  | A channel's `verifySetup` was called before the setup was started: `400` with the code `MFA_SETUP_NOT_INITIALIZED`                                    |
| `MfaSubjectNotFoundError`      | `MfaSubjectBase.findById` found no person for an `MfaService` or channel operation: `400` with the code `MFA_SUBJECT_NOT_FOUND`                       |
| `UnsupportedMfaMethodError`    | `MfaService` received a method without a registered channel: `400` with the code `UNSUPPORTED_MFA_METHOD`                                             |

A setup is confirmed by a person who is already signed in, so setup failures answer `400`. During sign-in, an expired or missing code or a disabled method answers `401`; issuing a new challenge can also answer `400` for a missing address, missing person, or a request inside the resend interval. `MfaService.verifyChallenge` still returns `false` for a rejected code.

The errors listed above extend `ProblemDetailException` and carry the listed HTTP status and stable `code`. Clients should branch on `code`; some messages and statuses differ from the former plain Nest exceptions, including invalid setup codes and expired setup challenges. If `MfaService.verifyChallenge` selects a method the person has not enabled, it throws Nest's `UnauthorizedException`.

The Archipel `useApi()` bootstrap step registers `ProblemDetailExceptionFilter` by default to render `application/problem+json`. The exceptions retain their HTTP status when used in a Nest application with a custom bootstrap.

## Resource Limits

| Limit                          | Value  | Description                                                      |
| ------------------------------ | ------ | ---------------------------------------------------------------- |
| In-memory challenge store size | 10,000 | `InMemoryChallengeStore` max entries; oldest evicted on overflow |

## Sessions

A session is identified by its own id, which every access token carries as the `sid` claim. Access tokens are never persisted, so reissuing one leaves the session untouched and cannot reject a client that is still using the previous token. Pass the session id to `AuthTokenService.createAccessToken(subject, sessionId)`.

`SessionService.create(userId, ipAddress, refreshTokenLifetimeMillis, options)` opens a session and returns its refresh token exactly once; only the hash is persisted. The credential belongs to the session rather than to the user, so every device keeps its own and signing in elsewhere does not evict it.

The exchange is transport-neutral: an opaque token in the request body, not a cookie. Browsers, native mobile applications and desktop applications therefore use the same flow, and each stores the credential in whatever its platform considers secure.

### Refresh

`SessionService.refresh(refreshToken, refreshTokenLifetimeMillis, activeAfter, now)` rotates the credential and reports a `SessionRefreshOutcome`:

| Outcome     | Meaning                                                                    |
| ----------- | -------------------------------------------------------------------------- |
| `REFRESHED` | The exchange succeeded and returned a successor token                      |
| `UNKNOWN`   | No session holds the credential, or a concurrent exchange won the rotation |
| `REPLAYED`  | The credential had already been replaced, so the session was revoked       |
| `INACTIVE`  | The session left its inactivity window                                     |
| `EXPIRED`   | The credential outlived its own validity                                   |

`REPLAYED` is the theft signal: a rotated credential that appears a second time revokes the whole session instead of issuing another one. Rotation itself is a conditional update, so two concurrent exchanges of the same credential cannot both succeed.

## Session Inactivity

`SessionService.isActive(sessionId, activeAfter)` checks one persisted session, while `hasActiveSession(userId, activeAfter)` checks whether a user has any active session. Both require activity strictly after the cutoff and leave timeout configuration, unauthorized-error mapping, and the definition of user activity to the consuming application. `purgeInactive(userId, activeBefore)` removes the sessions that already left the window.

`LastActiveMiddleware` records every authenticated HTTP request as activity. Applications that require literal user interaction should disable it and renew the persisted session only from an explicit activity endpoint.

## Lifecycle

- **Shutdown (`OnModuleDestroy`):** `InMemoryChallengeStore` clears its cleanup interval.

## Peer Dependencies

| Package                                   | Required | Notes                         |
| ----------------------------------------- | -------- | ----------------------------- |
| `@nestjs/common`                          | Yes      | NestJS core                   |
| `@nestjs/jwt`                             | Yes      | JWT token handling            |
| `class-validator`                         | Yes      | DTO validation                |
| `class-transformer`                       | Yes      | DTO transformation            |
| `passport`                                | Yes      | Authentication middleware     |
| `passport-jwt`                            | Yes      | JWT passport strategy         |
| `google-auth-library`                     | No       | Required for Google connector |
| `@pixel-brewery/archipel-platform-health` | No       | Required for health indicator |
| `@nestjs/terminus`                        | No       | Required for health indicator |

## Documentation

📖 **Auth Guide:** [`.docs/guides/authentication-and-authorization.md`](../../.docs/guides/authentication-and-authorization.md)

## Development

```bash
# Build
yarn nx build platform-authentication

# Test
yarn nx test platform-authentication

# Lint
yarn nx lint platform-authentication
```
