# @pixel-brewery/archipel-platform-database

Prisma-based database access layer with repositories, query builders, and cursor pagination for NestJS.

## Features

- **Prisma integration** — `PrismaService` wraps `PrismaClient` with lifecycle management
- **Repository base** — `RepositoryBase` with typed query execution pattern
- **Custom database clients** — `IRepositoryDatabase` lets repositories use any structurally compatible Prisma wrapper
- **Cursor pagination** — `CursorPagination` for efficient large-dataset traversal
- **Offset pagination** — Classic `Pagination` with total count and page metadata
- **Health checks** — `DatabaseHealthIndicator` for readiness probes (separate `/health` subpath)
- **Transaction support** — `PrismaService` exposes `$transaction` for multi-step writes

## ⚠️ Environment Variables

| Variable             | Required | Default | Description                          |
| -------------------- | -------- | ------- | ------------------------------------ |
| `DB_AUTO_CONNECTION` | no       | -       | Automatically connect on module init |

## Quick Start

```typescript
import { DatabaseModule, PrismaService } from '@pixel-brewery/archipel-platform-database';

// Health indicator (optional)
import { DatabaseHealthIndicator } from '@pixel-brewery/archipel-platform-database/health';

@Module({
    imports: [DatabaseModule],
})
export class AppModule {}
```

`RepositoryBase` depends on the public `IRepositoryDatabase` abstract base instead of
the concrete `DatabaseService`. A custom Prisma client wrapper can therefore be
passed to a repository when it provides the generic `transactionCallback`
method with a `Prisma.TransactionClient`.

## Error Handling

| Error Class       | When Thrown                            |
| ----------------- | -------------------------------------- |
| `RepositoryError` | Database query or transaction failures |

`RepositoryBase` wraps Prisma request errors in `RepositoryError` and classifies them through `kind` (`RepositoryErrorKinds`): `unique-constraint-violation` (`P2002`), `record-not-found` (`P2025`), or `unclassified`. Inside a query callback the raw Prisma error is still visible; the helpers recognize both forms:

| Helper                                                   | Purpose                                                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `isUniqueConstraintViolation(error)`                     | `true` for a write that violated a unique constraint                                                                     |
| `isRecordNotFound(error)`                                | `true` when a required record does not exist or no longer matches the filter                                             |
| `translateUniqueConstraintViolation(write, createError)` | Runs a write and throws the caller's error for a unique constraint violation, e.g. a concurrent duplicate name           |
| `translateRevisionConflict(write, createError)`          | Runs a revision-bound (compare-and-swap) write and throws the caller's conflict error when it no longer matches a record |

```typescript
return query<ConnectorDelegate, ConnectorModel>('updateConnector', (model) =>
    translateRevisionConflict(
        () => model.update({ where: { id, updatedAt: expectedUpdatedAt }, data }),
        () => new ConnectorRevisionConflictError(id),
    ),
);
```

Only wrap writes whose filter includes the observed revision with `translateRevisionConflict`; otherwise a plain missing record would be reported as a conflict.

## Lifecycle

- **Startup (`OnModuleInit`):** `PrismaService` connects to the database.
- **Shutdown (`OnModuleDestroy`):** `PrismaService` disconnects gracefully.

## Peer Dependencies

| Package                                   | Required | Notes                         |
| ----------------------------------------- | -------- | ----------------------------- |
| `@nestjs/common`                          | Yes      | NestJS core                   |
| `@nestjs/terminus`                        | No       | Required for health indicator |
| `@pixel-brewery/archipel-platform-health` | No       | Required for health indicator |
| `@prisma/client`                          | Yes      | Prisma ORM client             |
| `express`                                 | Yes      | HTTP server types             |

## Documentation

📖 **Database Guide:** [`.docs/guides/database-setup.md`](../../.docs/guides/database-setup.md)

## Development

```bash
# Build
yarn nx build platform-database

# Test
yarn nx test platform-database

# Lint
yarn nx lint platform-database
```

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
