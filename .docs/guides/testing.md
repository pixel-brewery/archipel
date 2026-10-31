---
title: Testing
description: Testing strategies and patterns for Archipel-powered NestJS applications.
order: 3
---

# Testing

This guide covers testing patterns for applications that use Archipel packages. It walks through unit testing services, testing adapters, building in-memory adapters for integration tests, and verifying that modules compose correctly.

Archipel uses [Vitest](https://vitest.dev/) as the test runner. All examples follow the Arrange-Act-Assert pattern.

---

## Unit Testing Services

When testing services that depend on Archipel abstract bases or other services, mock the dependencies and test business logic in isolation. Don't try to instantiate real modules — that's for integration tests.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './UserService.js';
import { type AuthSubjectBase } from '@pixel-brewery/archipel-platform-authentication';

describe('UserService', () => {
    let service: UserService;
    let mockAuthSubject: { findById: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        mockAuthSubject = {
            findById: vi.fn(),
        };
        service = new UserService(mockAuthSubject as unknown as AuthSubjectBase);
    });

    it('should return user when found', async () => {
        const user = { id: 'user-1', userName: 'alice', email: 'alice@test.com' };
        mockAuthSubject.findById.mockResolvedValue(user);

        const result = await service.getUser('user-1');

        expect(result).toEqual(user);
        expect(mockAuthSubject.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw when user not found', async () => {
        mockAuthSubject.findById.mockResolvedValue(null);

        await expect(service.getUser('missing')).rejects.toThrow();
    });
});
```

The key principle: mock at the boundary (the abstract base), not inside the implementation. Your test shouldn't know that `AuthSubjectBase` calls Prisma under the hood — it only knows the abstract base interface.

### Mocking the MappingService

The `MappingService` from `platform-core` is commonly injected in controllers to convert entities to response DTOs. Mock it in unit tests to avoid requiring mapping profile registration:

```typescript
import { MappingService } from '@pixel-brewery/archipel-platform-core';

const mockMappingService = {
    map: vi.fn((key, source) => source), // pass-through by default
} as unknown as MappingService;
```

When the mapping output matters for a specific test, configure the mock:

```typescript
it('should return mapped user response', async () => {
    mockMappingService.map = vi.fn().mockReturnValue({
        id: 'user-1',
        displayName: 'Alice',
    });

    const result = await controller.getUser('user-1');

    expect(result).toEqual({ id: 'user-1', displayName: 'Alice' });
    expect(mockMappingService.map).toHaveBeenCalledWith(USER_TO_RESPONSE, expect.any(Object));
});
```

### Mocking Repositories

Repositories extend `RepositoryBase` and use the `execute(query)` pattern internally. In tests, mock the repository's public methods directly — don't try to mock `execute()` or `PrismaService` internals:

```typescript
const mockUserRepository = {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
};
```

This keeps your tests decoupled from the data access implementation. If you later switch from Prisma to another ORM or change query structure, service tests stay unchanged.

---

## Testing adapters

adapters translate between your application's data model and the interface the platform library expects. They deserve their own tests because mapping errors are a common source of bugs.

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaAuthSubjectAdapter } from './PrismaAuthSubjectAdapter.js';

describe('PrismaAuthSubjectAdapter', () => {
    let adapter: PrismaAuthSubjectAdapter;
    let mockPrisma: {
        user: {
            findUnique: ReturnType<typeof vi.fn>;
            findFirst: ReturnType<typeof vi.fn>;
        };
    };

    beforeEach(() => {
        mockPrisma = {
            user: {
                findUnique: vi.fn(),
                findFirst: vi.fn(),
            },
        };
        adapter = new PrismaAuthSubjectAdapter(mockPrisma as never);
    });

    describe('findById', () => {
        it('should return null when user does not exist', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            const result = await adapter.findById('non-existent');

            expect(result).toBeNull();
        });

        it('should map database record to IAuthSubject', async () => {
            const dbUser = {
                id: 'user-1',
                userName: 'alice',
                email: 'alice@example.com',
                password: '$argon2id$hash',
                isVerified: true,
                isAnonymous: false,
                roles: ['user', 'admin'],
                mfaEnabled: false,
            };
            mockPrisma.user.findUnique.mockResolvedValue(dbUser);

            const result = await adapter.findById('user-1');

            expect(result).toEqual({
                id: 'user-1',
                userName: 'alice',
                email: 'alice@example.com',
                password: '$argon2id$hash',
                isVerified: true,
                isAnonymous: false,
                roles: ['user', 'admin'],
                mfaEnabled: false,
            });
        });
    });

    describe('findByLogin', () => {
        it('should search by both userName and email', async () => {
            mockPrisma.user.findFirst.mockResolvedValue(null);

            await adapter.findByLogin('alice@example.com');

            expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
                where: {
                    OR: [{ userName: 'alice@example.com' }, { email: 'alice@example.com' }],
                },
                select: expect.any(Object),
            });
        });
    });
});
```

### Testing Schema Mapping

When your database schema doesn't match the abstract base interface directly, your adapter performs a mapping. Test that mapping explicitly — it's where subtle bugs hide:

```typescript
it('should derive isAnonymous from user type field', async () => {
    const dbUser = {
        id: 'u1',
        username: 'guest_42',
        emailAddress: null,
        passwordHash: null,
        emailVerified: false,
        type: 'anonymous',
        userRoles: [{ role: { name: 'guest' } }],
        twoFactorEnabled: false,
    };
    mockPrisma.user.findUnique.mockResolvedValue(dbUser);

    const result = await adapter.findById('u1');

    expect(result?.isAnonymous).toBe(true);
    expect(result?.roles).toEqual(['guest']);
});
```

---

## In-Memory Adapters

For integration tests where you need working abstract bases without a real database, create in-memory implementations. They're fast, deterministic, and let you seed exactly the state you need for each test.

```typescript
import { Injectable } from '@nestjs/common';
import { AuthSubjectBase, type IAuthSubject } from '@pixel-brewery/archipel-platform-authentication';

@Injectable()
export class InMemoryAuthSubjectAdapter extends AuthSubjectBase {
    private readonly _subjects = new Map<string, IAuthSubject>();

    public seed(subjects: IAuthSubject[]): void {
        this._subjects.clear();
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

This pattern works for any abstract base. Store state in a `Map`, expose a `seed()` method for setup, and implement the abstract base interface. Your tests run in milliseconds without touching a database.

---

## Integration Testing with Module Composition

To verify that modules wire together correctly — that all providers resolve, abstract bases are bound to the right adapters, and services function end-to-end — bootstrap a minimal NestJS test module:

```typescript
import { Test } from '@nestjs/testing';
import { AuthModule, AuthTokenService, AuthSubjectBase } from '@pixel-brewery/archipel-platform-authentication';
import { ConfigModule } from '@pixel-brewery/archipel-platform-core';
import { InMemoryAuthSubjectAdapter } from './InMemoryAuthSubjectAdapter.js';
import { InMemoryMfaSubjectAdapter } from './InMemoryMfaSubjectAdapter.js';
import { InMemorySessionAdapter } from './InMemorySessionAdapter.js';
import { InMemoryVerificationAdapter } from './InMemoryVerificationAdapter.js';

describe('Auth module integration', () => {
    let authTokenService: AuthTokenService;
    let authSubjectAdapter: InMemoryAuthSubjectAdapter;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.register('test', TEST_CONFIG_ENTRIES),
                AuthModule.register({
                    authSubject: InMemoryAuthSubjectAdapter,
                    mfaSubject: InMemoryMfaSubjectAdapter,
                    sessionPersistence: InMemorySessionAdapter,
                    verificationSubject: InMemoryVerificationAdapter,
                }),
            ],
        }).compile();

        authTokenService = module.get(AuthTokenService);
        authSubjectAdapter = module.get(AuthSubjectBase) as InMemoryAuthSubjectAdapter;
    });

    it('should resolve AuthTokenService with all dependencies', () => {
        expect(authTokenService).toBeDefined();
    });

    it('should generate a valid JWT for a seeded user', async () => {
        authSubjectAdapter.seed([
            {
                id: 'user-1',
                userName: 'alice',
                email: 'alice@test.com',
                password: '$argon2id$hash',
                isVerified: true,
                isAnonymous: false,
                roles: ['user'],
                mfaEnabled: false,
            },
        ]);

        const token = await authTokenService.signToken({
            id: 'user-1',
            email: 'alice@test.com',
            roles: ['user'],
        });

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });
});
```

This catches wiring errors early. If you forget to register a required abstract base, mistype an adapter class, or have a circular dependency, `Test.createTestingModule(...).compile()` throws immediately with a clear error message.

---

## Pre-Release Checklist

Before shipping a new Archipel integration, verify:

- [ ] All required adapters have unit tests covering happy path and null/error cases
- [ ] Schema mapping is tested explicitly when database fields differ from abstract base interfaces
- [ ] Module composition boots without missing provider errors (integration test)
- [ ] Health indicators report correct status for connected infrastructure
- [ ] Error responses use documented error shapes, not raw NestJS exceptions
- [ ] Required environment variables fail fast at startup when missing
