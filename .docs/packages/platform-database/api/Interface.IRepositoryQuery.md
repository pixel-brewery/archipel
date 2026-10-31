---
title: 'Interface: IRepositoryQuery\<TDelegate, TResult\>'
generated: true
editUrl: false
---

# Interface: IRepositoryQuery\<TDelegate, TResult\>

Defined in: [libs/platform-database/src/repositories/queries/IRepositoryQuery.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/IRepositoryQuery.ts#L8)

Represents a reusable query definition for repositories.

## Type Parameters

| Type Parameter                                    | Description               |
| ------------------------------------------------- | ------------------------- |
| <a id="type-parameter-tdelegate"></a> `TDelegate` | The Prisma delegate type. |
| <a id="type-parameter-tresult"></a> `TResult`     | The query result type.    |

## Properties

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-database/src/repositories/queries/IRepositoryQuery.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/IRepositoryQuery.ts#L14)

The identifier used for logging.

## Methods

### run()

```ts
run(model): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/queries/IRepositoryQuery.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/queries/IRepositoryQuery.ts#L25)

Executes the query against the provided model.

#### Parameters

| Parameter | Type        | Description          |
| --------- | ----------- | -------------------- |
| `model`   | `TDelegate` | The Prisma delegate. |

#### Returns

`Promise`\<`TResult`\>
