---
title: Database Setup
description: Set up PostgreSQL access with Prisma, Prisma Accelerate, repositories, queries, transactions, health checks, and error handling.
order: 5
---

# Database Setup

This guide covers everything you need to connect a NestJS application to PostgreSQL through `platform-database`: module registration, Prisma Accelerate for connection pooling, writing repositories and queries, transactions, pagination, health checks, and error handling.

If you haven't installed `platform-core` and registered `ConfigModule` yet, read the [Getting Started](/guides/getting-started) guide first.

---

## Overview

`platform-database` provides:

| Capability                | What it does                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **DatabaseModule**        | Registers Prisma-backed services for DI with optional Accelerate support           |
| **DatabaseService**       | Extended Prisma client with transaction helpers                                    |
| **RepositoryBase**        | Abstract base class for typed repositories with built-in error handling            |
| **Query pattern**         | Reusable, testable query objects executed through repositories                     |
| **Transactional queries** | Multi-model writes wrapped in Prisma transactions                                  |
| **Pagination**            | Offset-based pagination with metadata (total, pages, next/prev)                    |
| **Health indicator**      | Terminus-based database health check, auto-registered with the health orchestrator |
| **Exception filter**      | Maps `RepositoryError` to HTTP 500 responses                                       |

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-database
```

`platform-database` depends on `@prisma/client`. Make sure your project has a Prisma schema and a generated client:

```bash
yarn add prisma @prisma/client
npx prisma init
```

---

## Environment Variables

`platform-database` ships its own config keys and a ready-made entries array. Set the relevant variables in your environment:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

For Prisma Accelerate (managed connection pooling), add the Accelerate URL from the Prisma Console:

```dotenv
DB_ACCELERATE_URL=prisma://accelerate.prisma-data.net/?api_key=your-accelerate-api-key
```

Optional environment variables for Prisma Optimize (query analysis dashboard):

```dotenv
DB_OPTIMIZE=true
DB_OPTIMIZE_API_KEY=your-optimize-api-key
```

All environment variables recognised by `platform-database`:

| Variable              | Description                               | Required            | Default |
| --------------------- | ----------------------------------------- | ------------------- | ------- |
| `DATABASE_URL`        | PostgreSQL connection string              | Yes                 | —       |
| `DB_ACCELERATE_URL`   | Prisma Accelerate proxy URL               | No                  | `''`    |
| `DB_AUTO_CONNECTION`  | Auto-connect on module init               | No                  | `true`  |
| `DB_OPTIMIZE`         | Enable Prisma Optimize query analysis     | No                  | `true`  |
| `DB_OPTIMIZE_API_KEY` | API key for the Prisma Optimize dashboard | If optimize enabled | `''`    |

### Register Config Entries

Use the exported `PLATFORM_DATABASE_CONFIG_ENTRIES` to register all database keys with the `ConfigModule` — no need to define them manually:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-core';
import { DatabaseModule, PLATFORM_DATABASE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-database';

@Module({
    imports: [ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES), DatabaseModule.register()],
})
export class AppModule {}
```

The `ConfigModule` validates all required keys at startup. If `DATABASE_URL` is missing, the application fails immediately with a clear error.

---

## Module Registration

### Basic Setup (No Accelerate)

For a direct PostgreSQL connection without Accelerate:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-core';
import { DatabaseModule, PLATFORM_DATABASE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-database';

@Module({
    imports: [ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES), DatabaseModule.register()],
})
export class AppModule {}
```

### With Prisma Accelerate

Accelerate provides connection pooling, global caching, and query optimization — especially useful in serverless or edge environments where direct database connections are expensive. You can enable it in two ways:

**Option A — Environment variable (recommended)**

Set `DB_ACCELERATE_URL` in your environment. The module reads it automatically via `ConfigService` — no code changes needed:

```dotenv
DB_ACCELERATE_URL=prisma://accelerate.prisma-data.net/?api_key=your-accelerate-api-key
```

```typescript
@Module({
    imports: [ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES), DatabaseModule.register()],
})
export class AppModule {}
```

**Option B — Module parameter (takes priority)**

Pass `accelerateUrl` explicitly. This overrides the environment variable:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-core';
import { DatabaseModule, PLATFORM_DATABASE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-database';

@Module({
    imports: [
        ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES),
        DatabaseModule.register({
            accelerateUrl: 'prisma://accelerate.prisma-data.net/?api_key=...',
        }),
    ],
})
export class AppModule {}
```

When an Accelerate URL is present (from either source), the Prisma client connects through the Accelerate proxy instead of directly to PostgreSQL. The `DATABASE_URL` is still required — Prisma uses it for schema generation and migrations. At runtime, all queries go through the Accelerate URL.

> **Resolution order:** module parameter → `DB_ACCELERATE_URL` environment variable → no Accelerate.

### Global Registration with `forRoot`

Use `forRoot()` to make `DatabaseService` globally available without re-importing the module in every feature module:

```typescript
@Module({
    imports: [ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES), DatabaseModule.forRoot()],
})
export class AppModule {}
```

With `forRoot()`, any module can inject `DatabaseService` without adding `DatabaseModule` to its own `imports`. Accelerate resolution works the same way — via environment variable or explicit `forRoot({ accelerateUrl: '...' })`.

---

## Defining Entities

Define entity interfaces that map to your Prisma models. Entity property names must match your Prisma schema exactly:

```typescript
// src/users/models/entities/IUserEntity.ts
export interface IUserEntity {
    readonly id: string;
    readonly userName: string;
    readonly email: string;
    readonly createdAt: Date;
}
```

Entities are plain interfaces — no methods, no business logic, no mapping. They are the contract between repositories and services.

---

## Writing Queries

Queries are plain objects created with the `query()` factory. Each query receives a Prisma delegate and returns a typed result. This keeps data access logic reusable, testable, and separate from repository class methods.

### Single-Model Query

```typescript
// src/users/queries/findUserByIdQuery.ts
import { query, type IRepositoryQuery } from '@pixel-brewery/archipel-platform-database';
import { type Prisma } from '@prisma/client';
import { type IUserEntity } from '../models/entities/IUserEntity.js';

type UserDelegate = Prisma.UserDelegate;

export const findUserByIdQuery = (id: string): IRepositoryQuery<UserDelegate, IUserEntity | null> =>
    query('findUserById', (model) =>
        model.findUnique({
            where: { id },
            select: { id: true, userName: true, email: true, createdAt: true },
        }),
    );
```

### Transactional Query

When a write spans multiple models, use `transactionalQuery()`. It receives a Prisma `TransactionClient` instead of a single delegate:

```typescript
// src/orders/queries/createOrderWithItemsQuery.ts
import { transactionalQuery } from '@pixel-brewery/archipel-platform-database';

export const createOrderWithItemsQuery = (userId: string, items: Array<{ productId: string; quantity: number }>) =>
    transactionalQuery('createOrderWithItems', async (tx) => {
        const order = await tx.order.create({
            data: { userId, status: 'pending' },
        });

        await tx.orderItem.createMany({
            data: items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            })),
        });

        return order;
    });
```

---

## Creating Repositories

Repositories extend `RepositoryBase` and execute queries. They receive `DatabaseService` and the Prisma delegate via constructor injection.

```typescript
// src/users/UserRepository.ts
import { Injectable } from '@nestjs/common';
import { RepositoryBase, DatabaseService } from '@pixel-brewery/archipel-platform-database';
import { type Prisma } from '@prisma/client';
import { findUserByIdQuery } from './queries/findUserByIdQuery.js';
import { type IUserEntity } from './models/entities/IUserEntity.js';

@Injectable()
export class UserRepository extends RepositoryBase<Prisma.UserDelegate, Prisma.UserArgs, Prisma.UserGetPayload<unknown>, IUserEntity> {
    constructor(db: DatabaseService) {
        super(db, db.user);
    }

    public async findById(id: string): Promise<IUserEntity | null> {
        return this.execute(findUserByIdQuery(id));
    }
}
```

### Executing Transactional Queries

Use `executeTransactional()` for queries that need a transaction client:

```typescript
import { Injectable } from '@nestjs/common';
import { RepositoryBase, DatabaseService } from '@pixel-brewery/archipel-platform-database';
import { type Prisma } from '@prisma/client';
import { createOrderWithItemsQuery } from './queries/createOrderWithItemsQuery.js';

@Injectable()
export class OrderRepository extends RepositoryBase<Prisma.OrderDelegate, Prisma.OrderArgs, Prisma.OrderGetPayload<unknown>> {
    constructor(db: DatabaseService) {
        super(db, db.order);
    }

    public async createWithItems(userId: string, items: Array<{ productId: string; quantity: number }>): Promise<unknown> {
        return this.executeTransactional(createOrderWithItemsQuery(userId, items));
    }
}
```

---

## Pagination

`platform-database` provides offset-based pagination. Pass page options to `findMany()`:

```typescript
import { type IPaginatedResult } from '@pixel-brewery/archipel-platform-database';

public async listUsers(page: number, perPage: number): Promise<IPaginatedResult<IUserEntity>> {
  return this.findMany(
    {
      select: { id: true, userName: true, email: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    },
    { page, perPage },
  );
}
```

The result contains:

```typescript
{
    data: Array<T>;
    meta: {
        total: number;
        lastPage: number;
        currentPage: number;
        perPage: number;
        prev: number | null;
        next: number | null;
    }
}
```

---

## Transactions via DatabaseService

For ad-hoc transactions that don't fit the query pattern, use `DatabaseService` directly:

### Batch Transaction

```typescript
const [user, profile] = await this._db.transaction([
    this._db.user.create({ data: { userName: 'alice', email: 'alice@example.com' } }),
    this._db.profile.create({ data: { userId: 'some-id', bio: 'Hello' } }),
]);
```

### Callback Transaction

```typescript
const result = await this._db.transactionCallback(async (tx) => {
    const user = await tx.user.create({ data: { userName: 'bob', email: 'bob@example.com' } });
    await tx.profile.create({ data: { userId: user.id, bio: 'Hey there' } });
    return user;
});
```

---

## Health Checks

`DatabaseModule` automatically registers a `DatabaseHealthIndicator` with the health orchestrator from `platform-health`. Once your application exposes a `/health` endpoint, database connectivity is checked via a `SELECT 1` ping. No additional configuration is needed.

If the health check fails, the indicator reports `database: down` with the error details.

---

## Error Handling

### RepositoryError

All Prisma errors caught by `RepositoryBase` are wrapped in `RepositoryError`, which classifies the failure and keeps the original Prisma error code and metadata:

```typescript
import { RepositoryError, RepositoryErrorKinds } from '@pixel-brewery/archipel-platform-database';

try {
    await userRepository.findById('non-existent');
} catch (error) {
    if (error instanceof RepositoryError) {
        console.log(error.code); // 'REPOSITORY_ERROR'
        console.log(error.kind); // e.g. RepositoryErrorKinds.RecordNotFound for Prisma P2025
        console.log(error.originalCode); // 'R_KNOWN' or 'R_UNKNOWN'
        console.log(error.meta); // Prisma error code and metadata
    }
}
```

`kind` is `unique-constraint-violation` (`P2002`), `record-not-found` (`P2025`), or `unclassified`. `isUniqueConstraintViolation(error)` and `isRecordNotFound(error)` recognize a failure both as `RepositoryError` and as the raw Prisma error inside a query callback. `translateUniqueConstraintViolation(write, createError)` and `translateRevisionConflict(write, createError)` run a write and report a unique constraint violation, or a revision-bound (compare-and-swap) write that no longer matches a record, as the caller's own error:

```typescript
export function createLocationQuery(data: ILocationData) {
    return query<LocationDelegate, LocationModel>('createLocation', (model) =>
        translateUniqueConstraintViolation(
            () => model.create({ data }),
            () => new LocationNameAlreadyExistsError(data.name),
        ),
    );
}
```

### RepositoryExceptionFilter

Register the global exception filter to automatically map `RepositoryError` to HTTP 500 responses:

```typescript
import { APP_FILTER } from '@nestjs/core';
import { RepositoryExceptionFilter } from '@pixel-brewery/archipel-platform-database';

@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: RepositoryExceptionFilter,
        },
    ],
})
export class AppModule {}
```

The filter returns a consistent error envelope:

```json
{
    "statusCode": 500,
    "timestamp": "2026-04-18T12:00:00.000Z",
    "error": "Repository Error",
    "path": "/api/v1/users/123"
}
```

---

## Prisma Schema and Migrations

Keep your Prisma schema in your project and use migrations for all schema changes:

```bash
# Create a new migration after changing schema.prisma
npx prisma migrate dev --name add-users-table

# Apply migrations in CI/CD
npx prisma migrate deploy

# Generate the Prisma client after schema changes
npx prisma generate
```

> **Important:** Never edit applied migrations. If you need to fix a migration, create a new one.

When using Accelerate, migrations still run against the direct `DATABASE_URL`. Only runtime queries go through the Accelerate proxy.

---

## Full Example

Putting it all together — a complete feature module with database access:

```typescript
// src/users/UserModule.ts
import { Module } from '@nestjs/common';
import { UserRepository } from './UserRepository.js';
import { UserService } from './UserService.js';
import { UserController } from './UserController.js';

@Module({
    providers: [UserRepository, UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
```

```typescript
// src/users/UserService.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository.js';
import { type IUserEntity } from './models/entities/IUserEntity.js';

@Injectable()
export class UserService {
    private readonly _userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }

    public async getUserById(id: string): Promise<IUserEntity | null> {
        return this._userRepository.findById(id);
    }
}
```

```typescript
// src/users/UserController.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './UserService.js';
import { MappingService } from '@pixel-brewery/archipel-platform-mapping';
import { USER_TO_RESPONSE } from './mapping-keys.js';

@Controller('users')
export class UserController {
    private readonly _userService: UserService;
    private readonly _mappingService: MappingService;

    constructor(userService: UserService, mappingService: MappingService) {
        this._userService = userService;
        this._mappingService = mappingService;
    }

    @Get(':id')
    public async getUser(@Param('id') id: string): Promise<unknown> {
        const user = await this._userService.getUserById(id);
        if (!user) {
            throw new NotFoundException(`User ${id} not found`);
        }

        return this._mappingService.map(USER_TO_RESPONSE, user);
    }
}
```

And the root module wiring everything together:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { DatabaseModule, PLATFORM_DATABASE_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-database';
import { UserModule } from './users/UserModule.js';

@Module({
    imports: [ConfigModule.register('database', PLATFORM_DATABASE_CONFIG_ENTRIES), MappingModule, DatabaseModule.forRoot(), UserModule],
})
export class AppModule {}
```

---

## Summary

| Task                    | How                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Register the module     | `DatabaseModule.register()` or `DatabaseModule.forRoot()` with optional Accelerate |
| Define entities         | Plain interfaces in `models/entities/`                                             |
| Write queries           | `query()` for single-model, `transactionalQuery()` for multi-model                 |
| Create repositories     | Extend `RepositoryBase`, inject `DatabaseService`                                  |
| Paginate results        | Pass `{ page, perPage }` to `findMany()`                                           |
| Run transactions        | `executeTransactional()`, `db.transaction()`, or `db.transactionCallback()`        |
| Monitor database health | Automatic via `DatabaseHealthIndicator`                                            |
| Handle errors           | `RepositoryExceptionFilter` for HTTP, `RepositoryError` for programmatic handling  |
| Use Prisma Accelerate   | Set `DB_ACCELERATE_URL` env var or pass `accelerateUrl` in module config           |

## PostgreSQL pool diagnostics

The optional `@pixel-brewery/archipel-platform-database/postgres` entry point exports `ObservedPool`, `IPoolObserver`, and `describeDatabaseFailure`. Install the optional `pg` peer (>=8.16.3) and `@types/pg` for TypeScript. The root and health entry points do not import `pg` or telemetry. The database package has no dependency on the telemetry package; any structurally compatible `IPoolObserver` can receive diagnostics.

```typescript
import { PrismaPg } from '@prisma/adapter-pg';
import { ObservedPool, describeDatabaseFailure } from '@pixel-brewery/archipel-platform-database/postgres';

const pool = new ObservedPool({ connectionString: databaseUrl, max: 1, connectionTimeoutMillis: 10000 });
const adapter = new PrismaPg(pool, {
    disposeExternalPool: true,
    onPoolError: (error) => pool.reportError(error),
    onConnectionError: (error) => pool.reportError(error),
});
// Once the host's diagnostics provider is available:
// pool.observe(diagnostics);
// MeasurementsModule.register({ diagnostics: { classifyFailure: describeDatabaseFailure } });
```

`ObservedPool` forwards the pool options unchanged. Promise and callback acquisitions, client release, maximum size, timeout, retry behavior and `end()` remain owned by `pg`. Acquisition emits `database_pool_acquire_total` and `database_pool_acquire_duration_ms` with success/failure outcomes. A failed acquisition reports the same original error through `failure('database', 'pool', error)` and rethrows it. Explicit `reportError` supports adapter callbacks. Observer errors are isolated from acquisition and disposal.

`observe()` emits an initial snapshot. The gauges `database_pool_connections`, `database_pool_idle`, `database_pool_waiting`, and `database_pool_max` describe one pool instance, not a cluster sum. Queue changes and errors force snapshots; release schedules a snapshot after `pg` updates its idle list, throttled to once per five seconds. No sampling timer or extra database connection is created. The host owns pool lifetime, readiness checks, resource labels and its provider-specific serverless pool attachment.

`describeDatabaseFailure(error)` inspects at most twelve distinct objects along `cause`, `meta`, and `driverAdapterError`, tolerating cycles and throwing accessors. It exports only `failure.kind`, `error.code`, and `cause.code`, retaining the outer and deepest allowed provider codes. Recognized kinds include pool timeout, transaction failure (`P2028`), PostgreSQL rule failure (`P0001`), connection failure, transaction conflict, database unavailability, and other Prisma errors. `P2028` produces `failure.kind=transaction`: Prisma uses this code for failures to start a transaction, closed transactions, rollback failures and other transaction errors. Neither that code nor message text is used to infer a transaction lifecycle phase. Consumers that filter on the former `transaction_closed` kind must use `transaction`; `error.code=P2028` is unchanged. Unrecognized codes become `UNKNOWN`; allowlisted connection-timeout messages are inspected only to classify pool acquisition timeouts, never exported. Messages, SQL, parameters, credentials and stacks are never returned. This operational classifier does not change repository error translation or domain error handling.

These are boundary observations, not deduplicated incidents or SQL tracing. A failure can be observed by the pool, healthcheck and HTTP handler. Preserve each original application result and configure provider alerts outside this package.

## SQL driver observations

`ObservedSqlAdapter` decorates Prisma's public `SqlDriverAdapterFactory` at the runtime adapter seam. It delegates connection, query results, thrown errors, disposal, connection information, transaction options and optional savepoint capabilities. It does not replace Prisma, parse results, or modify arguments. The observer receives only `ISqlObservation`: `durationMs` (monotonic elapsed time), `operation` (an allowlisted SQL command or `OTHER`), `outcome` (`success`/`failure`), `kind` (`query`/`transaction`/`script`) and `transaction` (boolean). No statement text, arguments, result rows, savepoint names or error messages leave the decorator. Observer failures log a fixed warning and preserve the delegate's result/error.

```typescript
import { DatabaseModule, ObservedSqlAdapter } from '@pixel-brewery/archipel-platform-database';
// Import and construct the provider adapter in the host.
DatabaseModule.forRoot({
    adapter: new ObservedSqlAdapter(providerAdapter, (observation) => {
        // Forward only this safe observation to the host's selected telemetry path.
    }),
});
```

Each `queryRaw` or `executeRaw` call emits one observation, including failures and operations inside interactive/batch transactions. These are client driver durations (network and possibly pool acquisition), not pure database-server execution time. Explicit COMMIT/ROLLBACK SQL can appear as `kind=query`. Transaction start/commit/rollback/savepoint methods use `kind=transaction`; a completion method can merely release a connection after Prisma has already sent COMMIT. Script execution is one `kind=script` observation for the entire script. Do not combine these populations or count transaction-method observations as additional SQL statements. The factory's initial `connect()` retains its original errors and is outside SQL timing; use the existing pool observer for acquisition and connection diagnostics.

This runtime wrapper intentionally does not expose migration/shadow-database methods. Use the original provider adapter for migrations. SQL fingerprints, locks, query plans and server resource statistics need separate instrumentation.
