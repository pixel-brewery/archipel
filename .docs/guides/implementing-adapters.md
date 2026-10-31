---
title: Implementing Adapters
description: How the base/adapter pattern works in Archipel and how to implement adapters for each package.
order: 2
---

# Implementing Adapters

Archipel libraries don't hardcode how you store data, send emails, or check permissions. Instead, they define **abstract bases** — abstract classes describing what the library needs — and your application provides **adapters** — concrete classes that implement those methods with your specific database, API, or logic.

This guide covers why abstract bases are abstract classes, which abstract bases exist across all packages, how to write and register adapters, and what happens when optional abstract bases are omitted.

## Why Abstract Classes?

NestJS uses a token-based dependency injection system. Every injectable needs a token for resolution. Abstract base classes serve two purposes simultaneously:

1. **Type contract** — They define the method signatures your adapter must implement. TypeScript enforces this at compile time.
2. **DI token** — NestJS can use the class reference directly as an injection token, so there's no need for separate `Symbol()` tokens or string identifiers.

```typescript
// Inside the platform library — you don't write this, it's already there
@Injectable()
export class SessionService {
    constructor(
        private readonly _sessionPersistence: SessionPersistenceBase,
        // The abstract class IS the DI token
    ) {}
}
```

When you pass `{ sessionPersistence: PrismaSessionAdapter }` to `register()`, the library binds your concrete class to the abstract class token. NestJS resolves it automatically wherever the abstract base is injected.

---

## Abstract Base Reference

Common application-supplied adapter contracts:

| Package                   | Abstract base                | Purpose                                        | Required |
| ------------------------- | ---------------------------- | ---------------------------------------------- | -------- |
| `platform-authentication` | `AuthSubjectBase`            | User lookup for authentication strategies      | Yes      |
| `platform-authentication` | `MfaSubjectBase`             | MFA state persistence (enable/disable, verify) | Yes      |
| `platform-authentication` | `SessionPersistenceBase`     | Session storage, querying, and cleanup         | Yes      |
| `platform-authentication` | `VerificationSubjectBase`    | Email/PIN verification persistence             | Yes      |
| `platform-authentication` | `SocialAuthBase`             | OAuth user creation and account linking        | No       |
| `platform-authentication` | `TokenEnricherBase`          | Add custom claims to JWTs                      | No       |
| `platform-blob-storage`   | `BlobObjectPersistenceBase`  | Track blob metadata after upload/delete        | No       |
| `platform-blob-storage`   | `BlobVariantPersistenceBase` | Track image variant metadata                   | No       |
| `platform-payments`       | `FeatureAccessBase`          | Feature quota checks and usage recording       | No       |

Other libraries also expose domain-specific abstract bases, including provider strategies, repositories, renderers, model contracts and the MCP client. Their public APIs document the required methods and configuration.

---

## Writing an Adapter

### Step 1: Create the Adapter File

Create one file per adapter in an `adapters/` directory in your application:

```
src/
  adapters/
    PrismaAuthSubjectAdapter.ts
    PrismaMfaSubjectAdapter.ts
    PrismaSessionAdapter.ts
    PrismaVerificationAdapter.ts
```

### Step 2: Extend the Abstract base

```typescript
import { Injectable } from '@nestjs/common';
import { AuthSubjectBase, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';
import { PrismaService } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class PrismaAuthSubjectAdapter extends AuthSubjectBase {
    private readonly _prisma: PrismaService;

    constructor(prisma: PrismaService) {
        super();
        this._prisma = prisma;
    }

    public async findById(id: string): Promise<IAuthSubject | null> {
        const user = await this._prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                userName: true,
                email: true,
                password: true,
                isVerified: true,
                isAnonymous: true,
                roles: true,
                mfaEnabled: true,
            },
        });

        return user ?? null;
    }

    public async findByLogin(login: string): Promise<IAuthSubject | null> {
        const user = await this._prisma.user.findFirst({
            where: { OR: [{ userName: login }, { email: login }] },
            select: {
                id: true,
                userName: true,
                email: true,
                password: true,
                isVerified: true,
                isAnonymous: true,
                roles: true,
                mfaEnabled: true,
            },
        });

        return user ?? null;
    }

    public async findAnonymous(userName: string): Promise<IAuthSubject | null> {
        const user = await this._prisma.user.findFirst({
            where: { userName, isAnonymous: true },
            select: {
                id: true,
                userName: true,
                email: true,
                password: true,
                isVerified: true,
                isAnonymous: true,
                roles: true,
                mfaEnabled: true,
            },
        });

        return user ?? null;
    }
}
```

**Key rules:**

- Always annotate with `@Injectable()` — the adapter is a NestJS provider and participates in DI.
- Always call `super()` in the constructor — the abstract class may have a constructor that sets up internal state.
- Return the abstract base's interface type (`IAuthSubject`, `ISessionRecord`, etc.), not your raw Prisma model. The abstract base defines the contract.
- Inject your own dependencies via constructor — the adapter has full access to NestJS DI, so it can use your `PrismaService`, `HttpService`, or anything else.
- One adapter per abstract base — don't combine multiple abstract bases in one class. NestJS resolves each abstract base token independently.

### Step 3: Register

Pass the adapter class (not an instance) to the module's `register()` method:

```typescript
AuthModule.register({
    authSubject: PrismaAuthSubjectAdapter,
    mfaSubject: PrismaMfaSubjectAdapter,
    sessionPersistence: PrismaSessionAdapter,
    verificationSubject: PrismaVerificationAdapter,
});
```

NestJS handles instantiation and dependency resolution. You pass the class reference, the framework does the rest.

---

## Schema Mapping

Your database schema won't always match the abstract base interface field-for-field. The adapter is where you handle the translation. This is one of the main reasons adapters exist — they decouple the library's expectations from your specific data model.

```typescript
public async findById(id: string): Promise<IAuthSubject | null> {
  const user = await this._prisma.user.findUnique({
    where: { id },
    include: { userRoles: { include: { role: true } } },
  });

  if (!user) return null;

  return {
    id: user.id,
    userName: user.username,              // different casing
    email: user.emailAddress,             // different field name
    password: user.passwordHash,          // different field name
    isVerified: user.emailVerified,       // different field name
    isAnonymous: user.type === 'anonymous', // derived from enum
    roles: user.userRoles.map((ur) => ur.role.name), // flattened relation
    mfaEnabled: user.twoFactorEnabled,    // different field name
  };
}
```

As long as the returned object satisfies the abstract base's interface, the platform library doesn't care what your underlying schema looks like.

---

## Adapters for External APIs

Abstract bases aren't limited to database adapters. You can implement an adapter that calls an external API, talks to a microservice, or reads from a cache — anything that fulfills the contract.

```typescript
@Injectable()
export class Auth0AuthSubjectAdapter extends AuthSubjectBase {
    private readonly _http: HttpService;

    constructor(http: HttpService) {
        super();
        this._http = http;
    }

    public async findById(id: string): Promise<IAuthSubject | null> {
        const { data } = await firstValueFrom(this._http.get(`https://my-tenant.auth0.com/api/v2/users/${id}`));

        return {
            id: data.user_id,
            userName: data.nickname,
            email: data.email,
            password: '',
            isVerified: data.email_verified,
            isAnonymous: false,
            roles: data.app_metadata?.roles ?? [],
            mfaEnabled: data.multifactor?.length > 0,
        };
    }

    public async findByLogin(login: string): Promise<IAuthSubject | null> {
        const { data } = await firstValueFrom(
            this._http.get('https://my-tenant.auth0.com/api/v2/users', {
                params: { q: `email:"${login}" OR nickname:"${login}"` },
            }),
        );

        return data[0] ? this.mapToAuthSubject(data[0]) : null;
    }

    // ...
}
```

The library has no idea it's talking to Auth0. It calls `findById()` and gets back an `IAuthSubject` — that's the entire contract.

---

## In-Memory Adapters for Testing

For integration tests where you need a working abstract base without a real database, create in-memory implementations:

```typescript
@Injectable()
export class InMemoryAuthSubjectAdapter extends AuthSubjectBase {
    private readonly _subjects = new Map<string, IAuthSubject>();

    public seed(subjects: IAuthSubject[]): void {
        subjects.forEach((s) => this._subjects.set(s.id, s));
    }

    public async findById(id: string): Promise<IAuthSubject | null> {
        return this._subjects.get(id) ?? null;
    }

    public async findByLogin(login: string): Promise<IAuthSubject | null> {
        return [...this._subjects.values()].find((s) => s.userName === login || s.email === login) ?? null;
    }

    public async findAnonymous(userName: string): Promise<IAuthSubject | null> {
        return [...this._subjects.values()].find((s) => s.userName === userName && s.isAnonymous) ?? null;
    }
}
```

This pattern works for any abstract base. Seed with test data, inject into the module under test, and your tests run fast and deterministically without database fixtures. See the [Testing](/guides/testing) guide for full integration test examples.

---

## Optional Abstract Bases

Some abstract bases are optional. When not provided, the library gracefully degrades — the feature that depends on that abstract base simply isn't available. The library's internal services use `@Optional()` on the injection, so they receive `undefined` and skip the corresponding logic.

### TokenEnricherBase (Authentication)

When omitted, JWTs contain only the base claims (`id`, `email`, `roles`). When provided, `AuthTokenService` calls your adapter's `enrichClaims()` method and merges the result into every token.

```typescript
@Injectable()
export class AppTokenEnricherAdapter extends TokenEnricherBase {
    public async enrichClaims(subject: IAuthSubject): Promise<Record<string, unknown>> {
        return {
            subscriptionTier: 'pro',
            organizationId: 'org-123',
        };
    }
}
```

### SocialAuthBase (Authentication)

When omitted, OAuth strategies (GitHub, Google, Microsoft, Apple) are not registered — the routes don't exist. When provided, all configured strategies become active and the library handles the OAuth callback flow.

### BlobObjectPersistenceBase / BlobVariantPersistenceBase (Blob Storage)

When omitted, blob uploads and deletes work normally, but metadata isn't tracked in your database. When provided, `BlobService` calls the persistence abstract base after each operation so you can maintain your own blob inventory.

### FeatureAccessBase (Payments)

When omitted, `FeatureGuard` and `FeatureUsageInterceptor` have no access abstract base and will deny or skip feature checks. When provided, they delegate quota enforcement and usage recording to your adapter.

`FeatureGuard` calls `checkAccess(userId, featureKey, context)`, while `FeatureUsageInterceptor` calls `recordUsage(userId, featureKey, context)` after a successful request. The `IFeatureAccessContext` contains the resolved `userId`, optional `tenantId`, and original authenticated subject, so adapters can enforce tenant-scoped plans without controller-specific billing logic.

---

## Common Mistakes

**Not calling `super()`** — If you forget `super()` in the constructor, JavaScript throws a runtime error. Abstract classes are still real classes with constructors.

**Returning raw Prisma objects** — If your Prisma model includes extra fields beyond what the abstract base interface expects, don't return it raw. Always map to the exact interface shape. Extra fields won't cause type errors but may leak internal data.

**Sharing adapters across abstract bases** — Don't make one class implement two different abstract bases. Each abstract base has its own DI token, and NestJS resolves them independently. One class, one abstract base, one responsibility.

**Registering instances instead of classes** — `register()` expects the class reference (`PrismaAuthSubjectAdapter`), not `new PrismaAuthSubjectAdapter()`. NestJS creates the instance and injects its dependencies automatically.

## Source Layout and Public Names

Every abstract class ends in `Base` and lives under an `abstracts/` subdirectory of its owning domain. Every interface starts with `I` and lives under `interfaces/`. Keep each public declaration in a dedicated file. Export both through the owning package entry point; consumers import the public package rather than its internal directory structure.

```text
src/
  abstracts/PaymentClientBase.ts
  interfaces/IPaymentModuleOptions.ts
  adapters/ExamplePaymentAdapter.ts
  index.ts
```

Abstract base classes retain their runtime identity as NestJS injection tokens. Concrete adapters extend them and are injectable. Interfaces remain compile-time contracts and are not used as runtime injection tokens.

The naming refactor changes public imports and inheritance names. Update consumers to the exported Base names, including `DocumentRendererBase`, `Repository2Base`, `ResponseReturnBase`, and the provider, persistence and realtime Base classes. No compatibility aliases with the retired naming are retained. Release version selection remains with the repository owner.
