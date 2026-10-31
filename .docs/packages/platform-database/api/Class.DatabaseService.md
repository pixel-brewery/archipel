---
title: 'Class: DatabaseService'
generated: true
editUrl: false
---

# Class: DatabaseService

Defined in: [libs/platform-database/src/services/DatabaseService.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/DatabaseService.ts#L17)

Represents the database service.

## Extends

- [`PrismaService`](Class.PrismaService)

## Implements

- [`IRepositoryDatabase`](Interface.IRepositoryDatabase)

## Indexable

```ts
[K: symbol]: {
}
```

## Constructors

### Constructor

```ts
new DatabaseService(configService, options?): DatabaseService;
```

Defined in: [libs/platform-database/src/services/DatabaseService.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/DatabaseService.ts#L25)

Constructs a new instance of the `DatabaseService` class.

#### Parameters

| Parameter       | Type                                                       |
| --------------- | ---------------------------------------------------------- |
| `configService` | `ConfigService`                                            |
| `options?`      | [`IPrismaServiceOptions`](Interface.IPrismaServiceOptions) |

#### Returns

`DatabaseService`

#### Overrides

[`PrismaService`](Class.PrismaService).[`constructor`](Class.PrismaService#constructor)

## Methods

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L69)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`PrismaService`](Class.PrismaService).[`onModuleDestroy`](Class.PrismaService#onmoduledestroy)

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-database/src/services/PrismaService.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/PrismaService.ts#L58)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`PrismaService`](Class.PrismaService).[`onModuleInit`](Class.PrismaService#onmoduleinit)

---

### transaction()

```ts
transaction<P>(arg, options?): Promise<unknown>;
```

Defined in: [libs/platform-database/src/services/DatabaseService.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/DatabaseService.ts#L41)

Creates a new transaction.

#### Type Parameters

| Type Parameter                                                             |
| -------------------------------------------------------------------------- |
| <a id="type-parameter-p"></a> `P` _extends_ `PrismaPromise`\<`unknown`\>[] |

#### Parameters

| Parameter  | Type         | Description   |
| ---------- | ------------ | ------------- |
| `arg`      | \[`...P[]`\] | The argument. |
| `options?` | \{ \}        | The options.  |

#### Returns

`Promise`\<`unknown`\>

Returns the result of the transaction.

---

### transactionCallback()

```ts
transactionCallback<T>(fn, options?): Promise<T>;
```

Defined in: [libs/platform-database/src/services/DatabaseService.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/services/DatabaseService.ts#L56)

Executes a transactional callback (extended overload missing in base typing wrapper).

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter  | Type                       |
| ---------- | -------------------------- |
| `fn`       | (`tx`) => `Promise`\<`T`\> |
| `options?` | \{ \}                      |

#### Returns

`Promise`\<`T`\>

#### Implementation of

[`IRepositoryDatabase`](Interface.IRepositoryDatabase).[`transactionCallback`](Interface.IRepositoryDatabase#transactioncallback)
