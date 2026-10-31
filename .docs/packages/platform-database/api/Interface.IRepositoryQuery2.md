---
title: 'Interface: IRepositoryQuery2\<TDelegate, TRun\>'
generated: true
editUrl: false
---

# Interface: IRepositoryQuery2\<TDelegate, TRun\>

Defined in: [libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts#L8)

Represents a reusable query definition for repositories.

## Template

**TResult**

The query result type.

## Type Parameters

| Type Parameter                                                          | Default type          | Description               |
| ----------------------------------------------------------------------- | --------------------- | ------------------------- |
| <a id="type-parameter-tdelegate"></a> `TDelegate`                       | -                     | The Prisma delegate type. |
| <a id="type-parameter-trun"></a> `TRun` _extends_ (`delegate`) => `any` | (`delegate`) => `any` | -                         |

## Properties

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts#L14)

The identifier used for logging.

---

### run

```ts
run: TRun;
```

Defined in: [libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/queries/IRepositoryQuery2.ts#L23)

Executes the query against the provided model.
