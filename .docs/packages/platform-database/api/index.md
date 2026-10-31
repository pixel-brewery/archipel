---
title: '@pixel-brewery/archipel-platform-database'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-database

## Classes

| Class                                                        | Description                                                                                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| [DatabaseHealthIndicator](Class.DatabaseHealthIndicator)     | Health indicator for database connectivity.                                                                                    |
| [DatabaseModule](Class.DatabaseModule)                       | -                                                                                                                              |
| [DatabaseService](Class.DatabaseService)                     | Represents the database service.                                                                                               |
| [ObservedPool](Class.ObservedPool)                           | Observes the public pg acquisition boundary without changing the pool's limits or retry behavior.                              |
| [ObservedSqlAdapter](Class.ObservedSqlAdapter)               | Observes Prisma's public driver boundary, preserving results, errors and transaction ownership.                                |
| [PrismaService](Class.PrismaService)                         | Represents the prisma service.                                                                                                 |
| [Repository2Base](Class.Repository2Base)                     | Minimal repository base that exposes the underlying Prisma delegate and provides a typed pipe helper for functional operators. |
| [RepositoryBase](Class.RepositoryBase)                       | The base class for all repositories.                                                                                           |
| [RepositoryError](Class.RepositoryError)                     | Error thrown when a repository operation fails.                                                                                |
| [RepositoryExceptionFilter](Class.RepositoryExceptionFilter) | Represents the Prisma client exception filter.                                                                                 |

## Interfaces

| Interface                                                                | Description                                                                                                    |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| [ICursorPaginatedResult](Interface.ICursorPaginatedResult)               | Represents the result of a cursor-paginated query.                                                             |
| [ICursorPaginateOptions](Interface.ICursorPaginateOptions)               | Options for cursor-based pagination.                                                                           |
| [IDatabaseModuleConfig](Interface.IDatabaseModuleConfig)                 | Represents the database module configuration.                                                                  |
| [IPaginatedResult](Interface.IPaginatedResult)                           | -                                                                                                              |
| [IPaginateOptions](Interface.IPaginateOptions)                           | -                                                                                                              |
| [IPoolObserver](Interface.IPoolObserver)                                 | Optional diagnostics adapter for the public PostgreSQL acquisition boundary. No telemetry package is required. |
| [IPrismaServiceOptions](Interface.IPrismaServiceOptions)                 | Represents the options for the PrismaService.                                                                  |
| [IRepositoryDatabase](Interface.IRepositoryDatabase)                     | Minimal database contract required by [RepositoryBase](Class.RepositoryBase).                                  |
| [IRepositoryQuery](Interface.IRepositoryQuery)                           | Represents a reusable query definition for repositories.                                                       |
| [IRepositoryQuery2](Interface.IRepositoryQuery2)                         | Represents a reusable query definition for repositories.                                                       |
| [ISqlObservation](Interface.ISqlObservation)                             | One completed Prisma driver operation, with no SQL text, arguments, result data or error messages.             |
| [ITransactionalRepositoryQuery](Interface.ITransactionalRepositoryQuery) | Represents a repository query that requires a Prisma TransactionClient to access multiple delegates.           |

## Type Aliases

| Type Alias                                                             | Description                                                                                                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [CursorPaginateFunction](TypeAlias.CursorPaginateFunction)             | The type of a cursor paginate function.                                                                                                                                                    |
| [DelegateArgs](TypeAlias.DelegateArgs)                                 | -                                                                                                                                                                                          |
| [DelegateOperations](TypeAlias.DelegateOperations)                     | Extracts the subset of known Prisma operations that a concrete delegate actually implements. Useful for type-level checks without requiring the consumer to state the provider explicitly. |
| [DelegateReturnTypes](TypeAlias.DelegateReturnTypes)                   | -                                                                                                                                                                                          |
| [PaginateFunction](TypeAlias.PaginateFunction)                         | -                                                                                                                                                                                          |
| [QueryResultType](TypeAlias.QueryResultType)                           | Extracts the result type from a repository query. Useful for type-safe mapping without duplicating query result types.                                                                     |
| [RepositoryErrorKind](TypeAlias.RepositoryErrorKind)                   | Union type derived from [RepositoryErrorKinds](Variable.RepositoryErrorKinds).                                                                                                             |
| [RepositoryOperationsAll](TypeAlias.RepositoryOperationsAll)           | Superset of all known Prisma model delegate operations across every supported database provider.                                                                                           |
| [RepositoryOperationsBase](TypeAlias.RepositoryOperationsBase)         | The baseline set of operations available on **every** Prisma provider (PostgreSQL, CockroachDB, SQLite, MySQL, MariaDB, SQL Server, MongoDB).                                              |
| [TransactionalQueryResultType](TypeAlias.TransactionalQueryResultType) | Extracts the result type from a transactional repository query.                                                                                                                            |

## Variables

| Variable                                                                         | Description                                                                       |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [DATABASE\_MODULE\_CONFIG](Variable.DATABASE_MODULE_CONFIG)                      | Represents the database module.                                                   |
| [DB\_AUTO\_CONNECTION](Variable.DB_AUTO_CONNECTION)                              | Whether to skip the automatic database connection on module init.                 |
| [PLATFORM\_DATABASE\_CONFIG\_ENTRIES](Variable.PLATFORM_DATABASE_CONFIG_ENTRIES) | Core configuration entries required by `platform-database`.                       |
| [RepositoryErrorKinds](Variable.RepositoryErrorKinds)                            | Classifies why a repository operation failed, independent of the database driver. |

## Functions

| Function                                                                          | Description                                                                                                                                                                              |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [aggregate](Function.aggregate)                                                   | Executes an aggregate query via the delegate `aggregate` method.                                                                                                                         |
| [aggregateRaw](Function.aggregateRaw)                                             | Executes a raw aggregate query via the delegate `aggregateRaw` method.                                                                                                                   |
| [count](Function.count)                                                           | Counts records via the delegate `count` method.                                                                                                                                          |
| [create](Function.create)                                                         | Creates a record using the underlying delegate `create` method.                                                                                                                          |
| [createMany](Function.createMany)                                                 | Creates multiple records via the delegate `createMany` method.                                                                                                                           |
| [createManyAndReturn](Function.createManyAndReturn)                               | Creates multiple records and returns them via the delegate `createManyAndReturn` method.                                                                                                 |
| [cursorPaginator](Function.cursorPaginator)                                       | Creates a cursor-based pagination function with the given default options.                                                                                                               |
| [describeDatabaseFailure](Function.describeDatabaseFailure)                       | Classifies provider failures without exporting messages, SQL, parameters or credentials.                                                                                                 |
| [findFirst](Function.findFirst)                                                   | Creates an operator that executes a `findFirst` query with the provided arguments.                                                                                                       |
| [findFirstOrThrow](Function.findFirstOrThrow)                                     | Finds the first record matching the criteria via the delegate `findFirstOrThrow` method. Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.               |
| [findMany](Function.findMany)                                                     | Finds many records via the delegate `findMany` method.                                                                                                                                   |
| [findManyPaged](Function.findManyPaged)                                           | Finds many records with pagination using the delegate `findMany` method.                                                                                                                 |
| [findRaw](Function.findRaw)                                                       | Executes a raw find query via the delegate `findRaw` method.                                                                                                                             |
| [findUnique](Function.findUnique)                                                 | Finds a unique record via the delegate `findUnique` method.                                                                                                                              |
| [findUniqueOrThrow](Function.findUniqueOrThrow)                                   | Finds a unique record via the delegate `findUniqueOrThrow` method. Throws a `PrismaClientKnownRequestError` with code `P2025` if no record is found.                                     |
| [groupBy](Function.groupBy)                                                       | Performs a group-by query via the delegate `groupBy` method.                                                                                                                             |
| [isRecordNotFound](Function.isRecordNotFound)                                     | Determines whether a repository operation failed because a required record does not exist or no longer matches the operation's filter.                                                   |
| [isUniqueConstraintViolation](Function.isUniqueConstraintViolation)               | Determines whether a repository write failed because it violated a unique constraint.                                                                                                    |
| [pageable](Function.pageable)                                                     | -                                                                                                                                                                                        |
| [paginator](Function.paginator)                                                   | -                                                                                                                                                                                        |
| [pipe](Function.pipe)                                                             | Executes a single operator against the provided delegate.                                                                                                                                |
| [pipeAll](Function.pipeAll)                                                       | Sequentially executes multiple operators. The last result is returned. Useful for multi-step dependent operations.                                                                       |
| [query](Function.query)                                                           | Creates a new repository query.                                                                                                                                                          |
| [query2](Function.query2)                                                         | Creates a new repository query.                                                                                                                                                          |
| [remove](Function.remove)                                                         | Deletes a single record via the delegate `delete` method.                                                                                                                                |
| [removeMany](Function.removeMany)                                                 | Deletes multiple records via the delegate `deleteMany` method.                                                                                                                           |
| [skip](Function.skip)                                                             | Utility function that returns the provided value or `undefined` if the value is `undefined`. In Prisma 6+, passing `undefined` for a field in a query signals Prisma to skip that field. |
| [transactionalQuery](Function.transactionalQuery)                                 | Factory to create a transactional repository query.                                                                                                                                      |
| [translateRevisionConflict](Function.translateRevisionConflict)                   | Runs a revision-bound (compare-and-swap) write and reports a changed or removed record as the caller's conflict error.                                                                   |
| [translateUniqueConstraintViolation](Function.translateUniqueConstraintViolation) | Runs a write and reports a unique constraint violation as the caller's error.                                                                                                            |
| [update](Function.update)                                                         | Updates a single record via the delegate `update` method.                                                                                                                                |
| [updateMany](Function.updateMany)                                                 | Updates multiple records via the delegate `updateMany` method.                                                                                                                           |
| [updateManyAndReturn](Function.updateManyAndReturn)                               | Updates multiple records and returns them via the delegate `updateManyAndReturn` method.                                                                                                 |
| [upsert](Function.upsert)                                                         | Creates or updates a record via the delegate `upsert` method.                                                                                                                            |
