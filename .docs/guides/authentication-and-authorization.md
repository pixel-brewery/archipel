---
title: Authentication & Authorization
description: Secure your NestJS application with JWT tokens, role-based access control, custom scopes, MFA, sessions, and OAuth social login.
order: 6
---

# Authentication & Authorization

This guide covers everything you need to secure an Archipel-powered NestJS application: JWT-based authentication, role-based authorization, custom token claims (scopes), multi-factor authentication, session management, and social login via OAuth providers.

If you haven't registered `AuthModule` yet, read the [Getting Started](/guides/getting-started) guide first.

---

## Overview

`platform-authentication` provides:

| Capability               | What it does                                                                |
| ------------------------ | --------------------------------------------------------------------------- |
| **JWT Authentication**   | Issues and validates signed access tokens via Passport                      |
| **Role-Based Guards**    | Restrict endpoints to specific roles using `@UseRoles()`                    |
| **Token Enrichment**     | Add custom claims (subscription tier, org ID, scopes) to every JWT          |
| **MFA**                  | TOTP, SMS, Email, and Push channels with backup codes                       |
| **Session Management**   | Track active sessions per user, with device info and last-active timestamps |
| **Email Verification**   | Issue and redeem time-limited verification tokens                           |
| **OAuth / Social Login** | GitHub, Google, Microsoft, and Apple strategies with account linking        |
| **Anonymous Auth**       | Allow guest access with limited capabilities                                |

---

## Protecting Routes with Guards

### JWT Guard

The `JwtAuthGuard` is the primary guard. It validates the `Authorization: Bearer <token>` header, decodes the JWT, looks up the user via `AuthSubjectBase.findById()`, and attaches the subject to `request.user`.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Controller('profile')
export class ProfileController {
    @Get()
    @UseGuards(JwtAuthGuard)
    public getProfile(@User() user: IAuthSubject): IAuthSubject {
        return user;
    }
}
```

The `@User()` decorator extracts the authenticated subject from the request. It returns the full `IAuthSubject` interface:

```typescript
interface IAuthSubject {
    readonly id: string;
    readonly userName: string | null;
    readonly email: string | null;
    readonly password: string | null;
    readonly isVerified: boolean;
    readonly isAnonymous: boolean;
    readonly roles: ReadonlyArray<string>;
    readonly mfaEnabled: boolean;
}
```

### Role-Based Access Control

Use `@UseRoles()` together with `RolesGuard` to restrict endpoints to users with specific roles. Roles are string-based, so you can define them as constants in your application.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard, UseRoles } from '@pixel-brewery/archipel-platform-authentication';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    @Get('dashboard')
    @UseRoles('admin')
    public getDashboard(): string {
        return 'admin-only content';
    }

    @Get('reports')
    @UseRoles('admin', 'moderator')
    public getReports(): string {
        return 'admin or moderator content';
    }
}
```

`RolesGuard` reads the required roles from the `@UseRoles()` metadata and checks them against `request.user.roles`. If no roles are specified on a handler, the guard allows access (only JWT validity is enforced).

**Best practice:** Define role constants in a shared file rather than using string literals:

```typescript
// src/constants/roles.ts
export const ROLE_ADMIN = 'admin';
export const ROLE_MODERATOR = 'moderator';
export const ROLE_USER = 'user';
```

```typescript
import { ROLE_ADMIN, ROLE_MODERATOR } from '../constants/roles.js';

@UseRoles(ROLE_ADMIN, ROLE_MODERATOR)
public getReports(): string { ... }
```

### Anonymous Guard

For routes that should accept unauthenticated users (e.g. guest checkout), use `AnonymousAuthGuard`. It creates or resolves an anonymous subject via `AuthSubjectBase.findAnonymous()`.

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { AnonymousAuthGuard, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Controller('cart')
export class CartController {
    @Post()
    @UseGuards(AnonymousAuthGuard)
    public addToCart(@User() user: IAuthSubject): void {
        // user.isAnonymous === true for guest users
    }
}
```

---

## Accessing the Raw Token

When you need the raw JWT string (e.g. to forward it to a downstream service), use the `@Token()` decorator:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Token } from '@pixel-brewery/archipel-platform-authentication';

@Controller('proxy')
export class ProxyController {
    @Get('downstream')
    @UseGuards(JwtAuthGuard)
    public forward(@Token() token: string): void {
        // token = the raw Bearer token string
    }
}
```

---

## Custom Token Claims (Scopes)

By default, JWTs contain base claims: `id`, `email`, and `roles`. To add application-specific claims — subscription tier, organization ID, feature scopes, permissions — implement the `TokenEnricherBase`.

### Step 1: Create the Enricher Adapter

```typescript
// src/adapters/AppTokenEnricherAdapter.ts
import { Injectable } from '@nestjs/common';
import { TokenEnricherBase, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';
import { SubscriptionRepository } from '../subscriptions/SubscriptionRepository.js';

@Injectable()
export class AppTokenEnricherAdapter extends TokenEnricherBase {
    private readonly _subscriptionRepository: SubscriptionRepository;

    constructor(subscriptionRepository: SubscriptionRepository) {
        super();
        this._subscriptionRepository = subscriptionRepository;
    }

    public async enrichClaims(subject: IAuthSubject): Promise<Record<string, unknown>> {
        const subscription = await this._subscriptionRepository.findByUserId(subject.id);

        return {
            subscriptionTier: subscription?.tier ?? 'free',
            organizationId: subscription?.organizationId ?? null,
            scopes: this.resolveScopes(subject.roles, subscription?.tier),
        };
    }

    private resolveScopes(roles: ReadonlyArray<string>, tier?: string): ReadonlyArray<string> {
        const scopes: Array<string> = ['read:profile'];

        if (roles.includes('admin')) {
            scopes.push('write:users', 'read:analytics', 'manage:settings');
        }

        if (tier === 'pro' || tier === 'enterprise') {
            scopes.push('export:reports', 'use:advanced-features');
        }

        return scopes;
    }
}
```

### Step 2: Register the Enricher

```typescript
AuthModule.register({
  authSubject: PrismaAuthSubjectAdapter,
  mfaSubject: PrismaMfaSubjectAdapter,
  sessionPersistence: PrismaSessionAdapter,
  verificationSubject: PrismaVerificationAdapter,
  tokenEnricher: AppTokenEnricherAdapter,  // <-- register here
}),
```

### Step 3: Read Custom Claims in Guards or Services

The enriched claims are part of the decoded JWT. Create a custom guard to enforce scopes:

```typescript
// src/guards/ScopesGuard.ts
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export const SCOPES_KEY = 'required_scopes';

export function RequireScopes(...scopes: Array<string>): MethodDecorator & ClassDecorator {
    return SetMetadata(SCOPES_KEY, scopes);
}

@Injectable()
export class ScopesGuard implements CanActivate {
    private readonly _reflector: Reflector;

    constructor(reflector: Reflector) {
        this._reflector = reflector;
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiredScopes = this._reflector.getAllAndOverride<Array<string>>(SCOPES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as Record<string, unknown>;
        const userScopes = (user['scopes'] as Array<string>) ?? [];

        const hasAllScopes = requiredScopes.every((scope) => userScopes.includes(scope));

        if (!hasAllScopes) {
            throw new ForbiddenException('Insufficient scopes');
        }

        return true;
    }
}
```

Use it on your endpoints:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@pixel-brewery/archipel-platform-authentication';
import { ScopesGuard, RequireScopes } from '../guards/ScopesGuard.js';

@Controller('reports')
@UseGuards(JwtAuthGuard, ScopesGuard)
export class ReportController {
    @Get()
    @RequireScopes('export:reports')
    public exportReport(): string {
        return 'report data';
    }
}
```

---

## Extending the JWT Payload

For type-safe access to custom claims, extend `JwtPayloadBase`:

```typescript
// src/models/AppJwtPayload.ts
import { JwtPayloadBase } from '@pixel-brewery/archipel-platform-authentication';

export class AppJwtPayload extends JwtPayloadBase {
    public readonly subscriptionTier: string;
    public readonly organizationId: string | null;
    public readonly scopes: ReadonlyArray<string>;

    constructor(
        id: string,
        email: string | null,
        roles: ReadonlyArray<string>,
        subscriptionTier: string,
        organizationId: string | null,
        scopes: ReadonlyArray<string>,
    ) {
        super(id, email, roles);
        this.subscriptionTier = subscriptionTier;
        this.organizationId = organizationId;
        this.scopes = scopes;
    }

    public override toJSON(): Record<string, unknown> {
        return {
            ...super.toJSON(),
            subscriptionTier: this.subscriptionTier,
            organizationId: this.organizationId,
            scopes: [...this.scopes],
        };
    }

    public static override fromJSON(raw: Record<string, unknown>): AppJwtPayload {
        return new AppJwtPayload(
            raw['id'] as string,
            (raw['email'] as string) ?? null,
            (raw['roles'] as string[]) ?? [],
            (raw['subscriptionTier'] as string) ?? 'free',
            (raw['organizationId'] as string) ?? null,
            (raw['scopes'] as string[]) ?? [],
        );
    }
}
```

---

## Session Management

`SessionService` tracks active sessions per user. Combined with `LastActiveMiddleware`, it can automatically update timestamps on every authenticated request.

### Storing a Session After Login

Sessions are stored automatically when you use the built-in authentication flow. If you implement a custom login controller:

```typescript
import { Controller, Post, UseGuards, Req, Ip } from '@nestjs/common';
import { LocalAuthGuard, AuthTokenService, SessionService, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    private readonly _tokenService: AuthTokenService;
    private readonly _sessionService: SessionService;

    constructor(tokenService: AuthTokenService, sessionService: SessionService) {
        this._tokenService = tokenService;
        this._sessionService = sessionService;
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    public async login(@User() user: IAuthSubject, @Req() req: Request, @Ip() ip: string): Promise<{ accessToken: string }> {
        const accessToken = await this._tokenService.createAccessToken(user);

        await this._sessionService.store(accessToken, user.id, ip);

        return { accessToken };
    }
}
```

### Listing & Revoking Sessions

```typescript
@Get('sessions')
@UseGuards(JwtAuthGuard)
public async listSessions(@User() user: IAuthSubject, @Token() token: string): Promise<Array<SessionResponse>> {
  return this._sessionService.listSessions(user.id, token);
}

@Delete('sessions/:token')
@UseGuards(JwtAuthGuard)
public async revokeSession(@Param('token') sessionToken: string): Promise<void> {
  await this._sessionService.revoke(sessionToken);
}
```

### Last-Active Middleware

`AuthModule` automatically registers `LastActiveMiddleware` on all routes. It extracts the Bearer token and updates the session's `lastActive` timestamp asynchronously — no blocking, no failure propagation.

That behavior treats every authenticated HTTP request as activity. For a strict inactivity timeout based on explicit browser interaction, disable the middleware, calculate the cutoff in the application, and use the session predicates before authorizing or rotating tokens:

```typescript
const activeAfter = new Date(Date.now() - idleTimeoutMillis);
const currentSessionActive = await sessionService.isActive(accessToken, activeAfter);
const refreshEligible = await sessionService.hasActiveSession(userId, activeAfter);
```

Map a `false` result to the application's session-expired domain error before continuing authentication or token rotation. Archipel intentionally leaves timeout configuration, error mapping, and the exact browser events that count as user activity to the consuming application.

Both `LastActiveMiddleware` and `LimitRequestSizeMiddleware` can be controlled via the `middleware` option:

```typescript
AuthModule.register({
  authSubject: PrismaAuthSubjectAdapter,
  mfaSubject: PrismaMfaSubjectAdapter,
  sessionPersistence: PrismaSessionAdapter,
  verificationSubject: PrismaVerificationAdapter,
  middleware: {
    lastActive: false,                // disable last-active tracking
    requestSizeLimit: 'users/signup', // custom path (default: 'auth/register')
  },
}),
```

| Option             | Type              | Default           | Description                                            |
| ------------------ | ----------------- | ----------------- | ------------------------------------------------------ |
| `lastActive`       | `boolean`         | `true`            | Enable/disable `LastActiveMiddleware` on all routes    |
| `requestSizeLimit` | `false \| string` | `'auth/register'` | Disable or set a custom path for size-limit middleware |

---

## Multi-Factor Authentication (MFA)

Archipel supports four MFA channels out of the box:

| Channel   | Method Key | How it works                                                |
| --------- | ---------- | ----------------------------------------------------------- |
| **TOTP**  | `totp`     | Time-based one-time passwords (Google Authenticator, Authy) |
| **SMS**   | `sms`      | OTP sent via SMS                                            |
| **Email** | `email`    | OTP sent via email                                          |
| **Push**  | `push`     | Push notification approval                                  |

### MFA Setup Flow

1. **Initiate setup** — Call `MfaService.initSetup(userId, method)` to get setup data (QR code URI for TOTP, etc.)
2. **Verify setup** — Call `MfaService.verifySetup(userId, method, code)` with the initial verification code
3. **Receive backup codes** — On successful verification, backup codes are generated and returned

A code that does not confirm the setup fails with `InvalidMfaCodeError`: `400 Bad Request` with the code `INVALID_MFA_CODE`. The person is already signed in, so the rejection deliberately avoids `401`, which clients treat as an ended session, and the setup can be confirmed again.

The other rejections of `MfaService` and its channels are problems with stable codes as well, for example `MfaMethodAlreadyEnabledError` (`MFA_METHOD_ALREADY_ENABLED`) when the method is already enabled, `MfaCodeRequiredError` (`MFA_CODE_REQUIRED`) for an empty code, `MfaSetupNotInitializedError` (`MFA_SETUP_NOT_INITIALIZED`) when a setup is confirmed before it was started, and `MfaSetupExpiredError` (`MFA_SETUP_EXPIRED`) when the email, SMS, or push setup code has expired. Setup failures answer `400`. During sign-in, expired or missing challenge codes and disabled methods answer `401`, while issuing a challenge can answer `400` for missing contact data or requests inside the resend interval. The package README lists all errors with their status.

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, MfaService, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Controller('mfa')
@UseGuards(JwtAuthGuard)
export class MfaController {
    private readonly _mfaService: MfaService;

    constructor(mfaService: MfaService) {
        this._mfaService = mfaService;
    }

    @Post('setup')
    public async initSetup(@User() user: IAuthSubject, @Body('method') method: string) {
        return this._mfaService.initSetup(user.id, method);
    }

    @Post('setup/verify')
    public async verifySetup(@User() user: IAuthSubject, @Body() body: { method: string; code: string }) {
        return this._mfaService.verifySetup(user.id, body.method, body.code);
    }
}
```

### MFA Login Flow

When a user with MFA enabled signs in, the `ISignInResult` indicates that a challenge is required:

```typescript
interface ISignInResult {
    readonly mfaRequired: boolean;
    readonly verificationRequired?: boolean;
    readonly accessToken?: string;
    readonly challengeId?: string;
}
```

If `mfaRequired` is `true`, the client receives a `challengeId` instead of an `accessToken`. The client must:

1. Call the MFA verification endpoint with the `challengeId` and the code from their authenticator app (or SMS/email).
2. On success, the server issues the actual `accessToken`.

### MFA Configuration

```dotenv
AUTH_MFA_ENCRYPTION_KEY=<32-byte-hex-key>
AUTH_MFA_CHALLENGE_EXPIRES_IN=5m
AUTH_MFA_MAX_ATTEMPTS=5
AUTH_MFA_SMS_CODE_TTL=10m
AUTH_MFA_SMS_MIN_RESEND=30s
AUTH_MFA_EMAIL_CODE_TTL=10m
AUTH_MFA_EMAIL_MIN_RESEND=30s
AUTH_MFA_PUSH_CODE_TTL=10m
AUTH_MFA_PUSH_MIN_RESEND=30s
```

---

## Email Verification

`VerificationService` handles token-based email verification:

```typescript
import { VerificationService } from '@pixel-brewery/archipel-platform-authentication';

// Issue a verification token (e.g., after registration)
const token = await verificationService.exhibitToken({ userId: user.id, email: user.email });
// Send this token in a verification email link

// Later, when the user clicks the link:
const isValid = await verificationService.verifyToken(token);
```

The token lifetime is controlled by `AUTH_VERIFY_JWT_EXPIRES_IN`.

---

## Social Login (OAuth)

### Step 1: Install Provider Strategies

Import strategies from their sub-paths:

```typescript
import { GoogleStrategy, GOOGLE_AUTH_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-authentication/google';
import { GithubStrategy, GITHUB_AUTH_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-authentication/github';
import { MicrosoftStrategy, MICROSOFT_AUTH_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-authentication/microsoft';
import { AppleStrategy, APPLE_AUTH_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-authentication/apple';
```

### Step 2: Implement the Social Auth Abstract Base

```typescript
// src/adapters/PrismaSocialAuthAdapter.ts
import { Injectable } from '@nestjs/common';
import { SocialAuthBase, type IAuthSubject, type ISocialProfile } from '@pixel-brewery/archipel-platform-authentication';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaSocialAuthAdapter extends SocialAuthBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async findOrCreateByProfile(profile: ISocialProfile): Promise<IAuthSubject> {
        // Look up by provider + email
        let user = await this._prisma.user.findFirst({
            where: { email: profile.email },
        });

        if (!user) {
            user = await this._prisma.user.create({
                data: {
                    email: profile.email,
                    userName: profile.userName ?? profile.displayName,
                    isVerified: true, // OAuth emails are pre-verified
                    isAnonymous: false,
                    roles: ['user'],
                    mfaEnabled: false,
                },
            });
        }

        return user as unknown as IAuthSubject;
    }
}
```

### Step 3: Register with Additional Config

```typescript
AuthModule.register({
  authSubject: PrismaAuthSubjectAdapter,
  mfaSubject: PrismaMfaSubjectAdapter,
  sessionPersistence: PrismaSessionAdapter,
  verificationSubject: PrismaVerificationAdapter,
  socialAuth: PrismaSocialAuthAdapter,
  socialStrategies: [GoogleStrategy, GithubStrategy],
  additionalConfigEntries: [
    ...GOOGLE_AUTH_CONFIG_ENTRIES,
    ...GITHUB_AUTH_CONFIG_ENTRIES,
  ],
}),
```

### Step 4: Set Environment Variables

```dotenv
# Google
AUTH_GOOGLE_CLIENT_ID=your-client-id
AUTH_GOOGLE_CLIENT_SECRET=your-client-secret
AUTH_GOOGLE_CALLBACK_URL=https://yourapp.com/auth/google/callback
AUTH_GOOGLE_SCOPE=email,profile

# GitHub
AUTH_GITHUB_CLIENT_ID=your-client-id
AUTH_GITHUB_CLIENT_SECRET=your-client-secret
AUTH_GITHUB_CALLBACK_URL=https://yourapp.com/auth/github/callback
AUTH_GITHUB_SCOPE=user:email
```

### Using the Social Auth Guard

The `SocialAuthGuard` is a dynamic guard that routes to the correct Passport strategy based on a URL parameter:

```typescript
import { Controller, Get, UseGuards, Req, Param } from '@nestjs/common';
import { socialAuthGuardFactory, User, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Controller('auth')
export class OAuthController {
    @Get(':provider')
    @UseGuards(socialAuthGuardFactory(':provider'))
    public initOAuth(): void {
        // Passport redirects to the provider
    }

    @Get(':provider/callback')
    @UseGuards(socialAuthGuardFactory(':provider'))
    public async handleCallback(@User() user: IAuthSubject): Promise<{ accessToken: string }> {
        const accessToken = await this._tokenService.createAccessToken(user);
        return { accessToken };
    }
}
```

Supported providers: `github`, `google`, `microsoft`, `apple`.

---

## Environment Variables Reference

| Variable                        | Required | Default | Description                              |
| ------------------------------- | -------- | ------- | ---------------------------------------- |
| `AUTH_JWT_SECRET`               | Yes      | —       | Secret for signing JWTs                  |
| `AUTH_JWT_EXPIRES_IN`           | Yes      | —       | Access token lifetime (e.g. `15m`, `1h`) |
| `AUTH_VERIFY_JWT_EXPIRES_IN`    | No       | —       | Verification token lifetime              |
| `AUTH_MFA_ENCRYPTION_KEY`       | No\*     | —       | AES key for encrypting MFA secrets       |
| `AUTH_MFA_CHALLENGE_EXPIRES_IN` | No       | `5m`    | MFA challenge TTL                        |
| `AUTH_MFA_MAX_ATTEMPTS`         | No       | `5`     | Max failed MFA attempts before lockout   |
| `AUTH_GOOGLE_CLIENT_ID`         | No\*     | —       | Google OAuth client ID                   |
| `AUTH_GOOGLE_CLIENT_SECRET`     | No\*     | —       | Google OAuth client secret               |
| `AUTH_GOOGLE_CALLBACK_URL`      | No\*     | —       | Google OAuth callback URL                |
| `AUTH_GOOGLE_SCOPE`             | No       | —       | Google OAuth scopes (comma-separated)    |
| `AUTH_GITHUB_CLIENT_ID`         | No\*     | —       | GitHub OAuth client ID                   |
| `AUTH_GITHUB_CLIENT_SECRET`     | No\*     | —       | GitHub OAuth client secret               |
| `AUTH_GITHUB_CALLBACK_URL`      | No\*     | —       | GitHub OAuth callback URL                |
| `AUTH_MICROSOFT_CLIENT_ID`      | No\*     | —       | Microsoft OAuth client ID                |
| `AUTH_MICROSOFT_CLIENT_SECRET`  | No\*     | —       | Microsoft OAuth client secret            |
| `AUTH_MICROSOFT_CALLBACK_URL`   | No\*     | —       | Microsoft OAuth callback URL             |
| `AUTH_MICROSOFT_TENANT`         | No       | —       | Microsoft tenant ID or `common`          |
| `AUTH_APPLE_CLIENT_ID`          | No\*     | —       | Apple Sign-In service ID                 |
| `AUTH_APPLE_PRIVATE_KEY`        | No\*     | —       | Apple Sign-In private key (PEM)          |
| `AUTH_APPLE_TEAM_ID`            | No\*     | —       | Apple developer team ID                  |
| `AUTH_APPLE_KEY_ID`             | No\*     | —       | Apple Sign-In key ID                     |
| `AUTH_APPLE_CALLBACK_URL`       | No\*     | —       | Apple Sign-In callback URL               |

\*Required only when the corresponding feature (MFA or specific OAuth provider) is enabled.

---

## Security Best Practices

1. **Keep `AUTH_JWT_SECRET` strong and rotated.** Use at least 256 bits of entropy. Never commit it to source control.
2. **Set short token lifetimes.** Use `15m` for access tokens and combine with session-based refresh logic.
3. **Always combine guards.** Use `JwtAuthGuard` + `RolesGuard` together. JWT alone only proves identity, not authorization.
4. **Validate at the boundary.** Use named Standard Schema contracts for new
   inputs. Keep decorated `class-validator` DTOs only as the legacy fallback,
   and never trust claims blindly.
5. **Use the `TokenEnricherBase` for scopes.** Don't hardcode authorization logic in guards. Derive scopes at token creation time and verify them declaratively.
6. **Enable MFA for sensitive operations.** Even if MFA isn't globally required, protect high-value actions (password change, payment) with step-up authentication.
7. **Monitor sessions.** Expose session listing to users so they can revoke unfamiliar sessions.

---

## Next Steps

- Read the [Implementing Adapters](/guides/implementing-adapters) guide for details on writing all four required adapters
- Browse the [platform-authentication API reference](/packages/platform-authentication/api/) for complete method signatures
- See the [Testing](/guides/testing) guide for patterns to mock auth in unit and integration tests
