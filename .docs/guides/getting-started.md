---
title: Getting Started
description: Set up an Archipel-powered NestJS application from scratch.
order: 1
---

# Getting Started

This guide walks you through adding Archipel packages to a NestJS application. By the end, you'll have a working setup with configuration management, database access, and authentication.

## Prerequisites

- Node.js 22.18.0 or later
- A NestJS 12 application
- PostgreSQL database (for `platform-database`)
- Prisma CLI (`npx prisma`)

This Node.js minimum also applies to the workspace tooling and the OpenTelemetry integration.

Archipel is ESM-only. The consuming application must declare `"type":
"module"` in `package.json` and compile with Node's ESM semantics:

```json
{
    "compilerOptions": {
        "module": "NodeNext",
        "moduleResolution": "NodeNext",
        "target": "ES2023"
    }
}
```

Use `.js` extensions for relative imports in TypeScript source. TypeScript
resolves them to the corresponding `.ts` files and preserves valid specifiers
for Node.js in the emitted JavaScript.

## Install the Foundation

Every Archipel application starts with `platform-core`, `platform-configuration`, and `platform-mapping`. Core provides templates, events, and cryptographic utilities. Mapping provides the object-to-object mapping system. Configuration provides the type-safe config system that all other packages depend on.

Archipel packages are hosted on GitHub Packages. Configure the `@pixel-brewery` scope and authenticate with a GitHub personal access token (classic) that has `read:packages` permission. For Yarn 4, add the following to `.yarnrc.yml`:

```yaml
npmScopes:
    pixel-brewery:
        npmAlwaysAuth: true
        npmAuthToken: '${NODE_AUTH_TOKEN}'
        npmRegistryServer: 'https://npm.pkg.github.com'
```

Set `NODE_AUTH_TOKEN` in your environment before installing dependencies. npm users can instead add the following to `.npmrc`:

```ini
@pixel-brewery:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
yarn add @pixel-brewery/archipel-platform-core @pixel-brewery/archipel-platform-configuration @pixel-brewery/archipel-platform-mapping
```

### Set Up Configuration

Archipel uses a type-safe configuration system. Instead of reading `process.env` directly, you define typed config keys and register them with the `ConfigModule`. This gives you compile-time safety, centralized validation, and default values — all scoped to your module.

Create a config file for your application:

```typescript
// src/env.ts
import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

export const DATABASE_URL = createConfigKey<string>('DATABASE_URL');
export const JWT_SECRET = createConfigKey<string>('JWT_SECRET');
export const JWT_EXPIRATION = createConfigKey<string>('JWT_EXPIRATION');

export const APP_CONFIG_ENTRIES: ReadonlyArray<IConfigRegistryEntry> = [
    { key: DATABASE_URL, module: 'app', required: true, description: 'PostgreSQL connection string' },
    { key: JWT_SECRET, module: 'app', required: true, description: 'Secret for signing JWTs' },
    { key: JWT_EXPIRATION, module: 'app', required: false, defaultValue: '1h', description: 'JWT token lifetime' },
];
```

Register it in your root module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { APP_CONFIG_ENTRIES } from './env.js';

@Module({
    imports: [ConfigModule.register('app', APP_CONFIG_ENTRIES)],
})
export class AppModule {}
```

Now you can inject `ConfigService` anywhere and read values with full type safety:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { JWT_SECRET } from './env.js';

@Injectable()
export class TokenService {
    private readonly _secret: string;

    constructor(configService: ConfigService) {
        this._secret = configService.get(JWT_SECRET);
        // TypeScript knows this is a string — no cast needed
    }
}
```

The `ConfigModule` validates all required keys at startup. If `DATABASE_URL` is missing from the environment, the application fails immediately with a clear error message instead of crashing later at runtime.

### Set Up Object Mapping

The `MappingModule` centralizes transformation from domain entities to
transport-model inputs. New endpoints validate and serialize those values with
named Standard Schemas and `ResponseReturn2`; existing class-based response DTOs
remain a supported migration fallback. This keeps mapping logic out of services
and controllers and makes it testable in isolation.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { APP_CONFIG_ENTRIES } from './env.js';
import { UserMappingProfile } from './mapping/UserMappingProfile.js';

@Module({
    imports: [ConfigModule.register('app', APP_CONFIG_ENTRIES), MappingModule],
    providers: [UserMappingProfile],
})
export class AppModule {}
```

You define mapping profiles that register transformations:

```typescript
import { Injectable } from '@nestjs/common';
import { MappingProfileBase, type MappingRegistry } from '@pixel-brewery/archipel-platform-mapping';
import { USER_TO_RESPONSE } from './mapping-keys.js';

@Injectable()
export class UserMappingProfile extends MappingProfileBase {
    public override configure(registry: MappingRegistry): void {
        registry.createMap(USER_TO_RESPONSE, (source: IUserEntity) => ({
            id: source.id,
            name: source.userName,
            email: source.email,
        }));
    }
}
```

Then use `MappingService.map()` in controllers to convert entities to responses without leaking mapping logic into services.

---

## Add Database Access

Install the database package:

```bash
yarn add @pixel-brewery/archipel-platform-database
```

`platform-database` provides a repository + query pattern on top of Prisma. Instead of calling Prisma directly from services, you define query objects and execute them through a repository base class. This keeps data access logic encapsulated, testable, and separate from business logic.

Register the module:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { DatabaseModule } from '@pixel-brewery/archipel-platform-database';
import { APP_CONFIG_ENTRIES } from './env.js';

@Module({
    imports: [ConfigModule.register('app', APP_CONFIG_ENTRIES), MappingModule, DatabaseModule.register()],
})
export class AppModule {}
```

### Define Queries

A query is a plain object that describes a database operation. It receives a Prisma client and returns a result:

```typescript
// src/users/queries/findUserByIdQuery.ts
import { type IRepositoryQuery } from '@pixel-brewery/archipel-platform-database';
import { type PrismaClient } from '@prisma/client';

export interface IUserEntity {
    id: string;
    userName: string;
    email: string;
}

export const findUserByIdQuery = (id: string): IRepositoryQuery<PrismaClient, IUserEntity | null> => ({
    execute: (prisma) =>
        prisma.user.findUnique({
            where: { id },
            select: { id: true, userName: true, email: true },
        }),
});
```

### Create a Repository

Repositories extend `RepositoryBase` and execute queries:

```typescript
// src/users/UserRepository.ts
import { Injectable } from '@nestjs/common';
import { RepositoryBase } from '@pixel-brewery/archipel-platform-database';
import { findUserByIdQuery, type IUserEntity } from './queries/findUserByIdQuery.js';

@Injectable()
export class UserRepository extends RepositoryBase {
    public async findById(id: string): Promise<IUserEntity | null> {
        return this.execute(findUserByIdQuery(id));
    }
}
```

This pattern means your services never touch Prisma directly. They call repository methods, which execute typed queries. When you need to test a service, you mock the repository — not Prisma internals.

---

## Add Authentication

Install the authentication package:

```bash
yarn add @pixel-brewery/archipel-platform-authentication
```

Authentication is the first package where you encounter **abstract bases** — abstract classes that define contracts between the library and your application. `AuthModule` requires four abstract base implementations that tell it how to look up users, sessions, MFA state, and verification records in your specific data store.

### Implement the Required Abstract Bases

Here's the most important one — `AuthSubjectBase`, which handles user lookup:

```typescript
// src/adapters/PrismaAuthSubjectAdapter.ts
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

You'll implement the same pattern for `MfaSubjectBase`, `SessionPersistenceBase`, and `VerificationSubjectBase`. Each abstract base's abstract methods are documented in the [platform-authentication API reference](/packages/platform-authentication/api/).

### Register the Module

Pass your adapter classes to `AuthModule.register()`:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { DatabaseModule } from '@pixel-brewery/archipel-platform-database';
import { AuthModule } from '@pixel-brewery/archipel-platform-authentication';
import { APP_CONFIG_ENTRIES } from './env.js';
import { PrismaAuthSubjectAdapter } from './adapters/PrismaAuthSubjectAdapter.js';
import { PrismaMfaSubjectAdapter } from './adapters/PrismaMfaSubjectAdapter.js';
import { PrismaSessionAdapter } from './adapters/PrismaSessionAdapter.js';
import { PrismaVerificationAdapter } from './adapters/PrismaVerificationAdapter.js';

@Module({
    imports: [
        ConfigModule.register('app', APP_CONFIG_ENTRIES),
        MappingModule,
        DatabaseModule.register(),
        AuthModule.register({
            authSubject: PrismaAuthSubjectAdapter,
            mfaSubject: PrismaMfaSubjectAdapter,
            sessionPersistence: PrismaSessionAdapter,
            verificationSubject: PrismaVerificationAdapter,
        }),
    ],
})
export class AppModule {}
```

The `AuthModule` now has everything it needs. Its internal services (`AuthTokenService`, `SessionService`, `MfaService`, `VerificationService`) are available for injection in your controllers and services.

### Optional Abstract Bases

`AuthModule` also accepts two optional abstract bases:

- **`socialAuth`** — Provide a `SocialAuthBase` adapter to enable OAuth strategies (GitHub, Google, Microsoft, Apple). Without it, those routes don't exist.
- **`tokenEnricher`** — Provide a `TokenEnricherBase` adapter to add custom claims (subscription tier, org ID, etc.) to every JWT. Without it, tokens contain only the base claims.

```typescript
AuthModule.register({
  authSubject: PrismaAuthSubjectAdapter,
  mfaSubject: PrismaMfaSubjectAdapter,
  sessionPersistence: PrismaSessionAdapter,
  verificationSubject: PrismaVerificationAdapter,
  socialAuth: PrismaSocialAuthAdapter,     // optional: enables OAuth
  tokenEnricher: AppTokenEnricherAdapter,  // optional: enriches JWTs
}),
```

---

## Adding More Packages

Every Archipel package follows the same integration pattern:

1. **Install** the package with `yarn add @pixel-brewery/archipel-<name>`
2. **Check** its documentation page under [Packages](/packages/) for required abstract bases and configuration
3. **Implement** adapter classes for required abstract bases (if any)
4. **Register** the module with `SomeModule.register({ ... })`
5. **Inject** the package's services where you need them

Some packages, including `platform-logging` and `platform-openapi`, compose directly through module registration. Others offer optional abstract bases or provider strategies; consult their public configuration contracts before supplying adapters.

---

## Next Steps

- Read the [Implementing Adapters](/guides/implementing-adapters) guide for a thorough explanation of the abstract bases and adapters pattern across all packages
- Browse the [Packages](/packages/) section for detailed documentation on each module
- Check the [Architecture](/architecture/) overview for the dependency graph and design principles
