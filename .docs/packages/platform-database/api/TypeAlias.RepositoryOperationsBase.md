---
title: 'Type Alias: RepositoryOperationsBase'
generated: true
editUrl: false
---

# Type Alias: RepositoryOperationsBase

```ts
type RepositoryOperationsBase =
    | 'aggregate'
    | 'count'
    | 'create'
    | 'createMany'
    | 'delete'
    | 'deleteMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'findMany'
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'groupBy'
    | 'update'
    | 'updateMany'
    | 'upsert';
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L29)

The baseline set of operations available on **every** Prisma provider
(PostgreSQL, CockroachDB, SQLite, MySQL, MariaDB, SQL Server, MongoDB).

Provider-specific extras (e.g. `createManyAndReturn` on PostgreSQL) are
deliberately excluded so that consumers targeting any provider satisfy
the constraint automatically.
