---
title: Repository Pattern
description: RepositoryBase subclasses, DelegateArgs/DelegateReturnTypes helpers, module registration, and service injection.
order: 8
---

# Archipel Repository Pattern

## Overview

Every Prisma model gets a dedicated **Repository class** extending `RepositoryBase`.
Repositories are the ONLY code that touches Prisma delegates. Services never call
Prisma directly — they call `repository.execute(someQuery(...))` or
`repository.executeTransactional(someTxQuery(...))`.

## RepositoryBase Signature

```typescript
import { RepositoryBase } from '@pixel-brewery/archipel-platform-database';

export abstract class RepositoryBase<
  TDelegate extends Record<RepositoryOperations, (args: any) => Promise<any>>,
  TArgs extends Record<RepositoryOperations, unknown>,
  TReturn extends Record<RepositoryOperations, unknown>,
  TEntity = unknown
>
```

### Generic Parameters

| Param       | Purpose                                    | Example                         |
| ----------- | ------------------------------------------ | ------------------------------- |
| `TDelegate` | Prisma delegate type from generated client | `Prisma.UserDelegate`           |
| `TArgs`     | Argument shapes for each operation         | `Prisma.UserFindManyArgs`, etc. |
| `TReturn`   | Return shapes for each operation           | `User`, `User[]`, etc.          |
| `TEntity`   | Domain entity interface (optional)         | `IUserEntity`                   |

### Helper Types

```typescript
import { DelegateArgs, DelegateReturnTypes } from '@pixel-brewery/archipel-platform-database';

// These extract args and return types from a delegate automatically:
type UserArgs = DelegateArgs<Prisma.UserDelegate>;
type UserReturns = DelegateReturnTypes<Prisma.UserDelegate>;
```

## How to Create a Repository

### Step 1: Create the repository class

```typescript
// repositories/UserRepository.ts
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService, DelegateArgs, DelegateReturnTypes, RepositoryBase } from '@pixel-brewery/archipel-platform-database';

@Injectable()
export class UserRepository extends RepositoryBase<
    Prisma.UserDelegate,
    DelegateArgs<Prisma.UserDelegate>,
    DelegateReturnTypes<Prisma.UserDelegate>,
    IUserEntity
> {
    // #region Ctor

    public constructor(db: DatabaseService) {
        super(db, db.client.user);
    }

    // #endregion
}
```

The constructor receives `DatabaseService` and passes both the service and the
Prisma delegate (`db.client.user`) to the base class.

### Step 2: Register as a provider in a module

```typescript
@Module({
    imports: [DatabaseModule.register()],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UserModule {}
```

### Step 3: Inject into a service

```typescript
@Injectable()
export class UserService {
    // #region Fields

    private readonly _userRepository: UserRepository;

    // #endregion

    // #region Ctor

    public constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }

    // #endregion

    // #region Methods

    public async findById(id: string): Promise<IUserEntity | null> {
        return this._userRepository.execute(findUserByIdQuery(id));
    }

    public async findAll(skip = 0, take = 20): Promise<IUserEntity[]> {
        return this._userRepository.execute(findAllUsersQuery(skip, take));
    }

    // #endregion
}
```

## Key Methods on RepositoryBase

### execute(query)

Primary method for data access. Delegates to a query object.

```typescript
public execute<TResult>(query: IRepositoryQuery<TDelegate, TResult>): Promise<TResult>
```

### executeTransactional(query)

For multi-model operations within a transaction.

```typescript
public executeTransactional<TResult>(query: ITransactionalRepositoryQuery<TResult>): Promise<TResult>
```

### Direct Methods (for legacy or internal use only)

The base class also exposes `findUnique`, `findMany`, `findFirst`, `create`,
`createMany`, `update`, `updateMany`, `upsert`, `delete`, `deleteMany`,
`aggregate`, `count`, `groupBy`, `merge`.

**Important:** New code should use `execute(query)` exclusively.
Direct method calls are available but violate the query pattern convention.

### findMany with Pagination

```typescript
// Direct method (legacy)
const results = await this._repository.findMany(args, { page: 1, perPage: 20 });
```

## Error Handling

All Prisma errors are caught by the base class `tryCatch` wrapper and re-thrown
as `RepositoryError`:

- `PrismaClientKnownRequestError` → `RepositoryError` with code `'R_KNOWN'`
- `PrismaClientUnknownRequestError` → `RepositoryError` with code `'R_UNKNOWN'`
- Other errors are re-thrown unchanged

The global `RepositoryExceptionFilter` catches `RepositoryError` and returns
HTTP 500 with a structured envelope.

## Query Integration

Repositories work with query factories from the query pattern:

```typescript
// queries/findUserByIdQuery.ts
import { Prisma } from '@prisma/client';
import { query } from '@pixel-brewery/archipel-platform-database';

export function findUserByIdQuery(id: string) {
    return query<Prisma.UserDelegate, IUserEntity | null>('findUserById', (model) =>
        model.findFirst({
            where: { id },
            select: { id: true, email: true, name: true, createdAt: true },
        }),
    );
}

// Service usage:
const user = await this._userRepository.execute(findUserByIdQuery(id));
```

## Rules

1. **One repository per Prisma model** — e.g. `UserRepository`, `OrderRepository`.
2. **Constructor receives `DatabaseService`** and passes the delegate via `db.client.<model>`.
3. **Use `DelegateArgs` and `DelegateReturnTypes`** helper types for the RepositoryBase generics.
4. **New code uses `execute(query)`** — never direct calls like `repository.findFirst()` from services.
5. **Register as provider** in the feature module, import `DatabaseModule.register()`.
6. **Repositories are `@Injectable()`** — they participate in NestJS DI.
7. **Domain entity interface as fourth generic** (`TEntity`) is optional but recommended.
