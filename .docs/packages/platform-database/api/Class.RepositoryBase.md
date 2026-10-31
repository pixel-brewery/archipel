---
title: 'Abstract Class: RepositoryBase\<TDelegate, TArgs, TReturn, TEntity\>'
generated: true
editUrl: false
---

# Abstract Class: RepositoryBase\<TDelegate, TArgs, TReturn, TEntity\>

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L66)

The base class for all repositories.

## Type Parameters

| Type Parameter                                                                                                                                                           | Default type |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| <a id="type-parameter-tdelegate"></a> `TDelegate` _extends_ `Record`\<[`RepositoryOperationsBase`](TypeAlias.RepositoryOperationsBase), (`args`) => `Promise`\<`any`\>\> | -            |
| <a id="type-parameter-targs"></a> `TArgs` _extends_ `Record`\<[`RepositoryOperationsBase`](TypeAlias.RepositoryOperationsBase), `unknown`\>                              | -            |
| <a id="type-parameter-treturn"></a> `TReturn` _extends_ `Record`\<[`RepositoryOperationsBase`](TypeAlias.RepositoryOperationsBase), `unknown`\>                          | -            |
| <a id="type-parameter-tentity"></a> `TEntity`                                                                                                                            | `unknown`    |

## Constructors

### Constructor

```ts
new RepositoryBase<TDelegate, TArgs, TReturn, TEntity>(db, model): RepositoryBase<TDelegate, TArgs, TReturn, TEntity>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:96](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L96)

Constructs a new instance of the repository.

#### Parameters

| Parameter | Type                                                                                                         |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| `db`      | [`IRepositoryDatabase`](Interface.IRepositoryDatabase)                                                       |
| `model`   | `Record`\<[`RepositoryOperationsBase`](TypeAlias.RepositoryOperationsBase), (`args`) => `Promise`\<`any`\>\> |

#### Returns

`RepositoryBase`\<`TDelegate`, `TArgs`, `TReturn`, `TEntity`\>

#### Remarks

The `model` parameter accepts any Prisma delegate that structurally satisfies
the required operations. This wider signature avoids `GlobalOmitOptions`
mismatches introduced in Prisma 7 where `PrismaClient` instantiates delegates
with `PrismaClientOptions` while consumer code references them with the
default `{}`.

## Accessors

### database

#### Get Signature

```ts
get protected database(): IRepositoryDatabase;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:119](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L119)

Provides access to the database transaction abstract base for derived repositories.
Only to be used for transactional orchestration that spans multiple models.

##### Returns

[`IRepositoryDatabase`](Interface.IRepositoryDatabase)

---

### model

#### Get Signature

```ts
get protected model(): TDelegate;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:109](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L109)

##### Returns

`TDelegate`

## Methods

### aggregate()

```ts
protected aggregate<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:312](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L312)

Performs aggregation operations on the records.

#### Type Parameters

| Type Parameter                                | Default type               |
| --------------------------------------------- | -------------------------- |
| <a id="type-parameter-tresult"></a> `TResult` | `TReturn`\[`"aggregate"`\] |

#### Parameters

| Parameter | Type                     | Description                               |
| --------- | ------------------------ | ----------------------------------------- |
| `args`    | `TArgs`\[`"aggregate"`\] | The arguments to perform the aggregation. |

#### Returns

`Promise`\<`TResult`\>

The aggregation result.

---

### count()

```ts
protected count<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:324](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L324)

Counts the number of records that match the criteria.

#### Type Parameters

| Type Parameter                                  | Default type           |
| ----------------------------------------------- | ---------------------- |
| <a id="type-parameter-tresult-1"></a> `TResult` | `TReturn`\[`"count"`\] |

#### Parameters

| Parameter | Type                 | Description                         |
| --------- | -------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"count"`\] | The arguments to count the records. |

#### Returns

`Promise`\<`TResult`\>

The count of matching records.

---

### create()

```ts
protected create<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:228](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L228)

Creates a new record.

#### Type Parameters

| Type Parameter                                  | Default type            |
| ----------------------------------------------- | ----------------------- |
| <a id="type-parameter-tresult-2"></a> `TResult` | `TReturn`\[`"create"`\] |

#### Parameters

| Parameter | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"create"`\] | The arguments to create the record. |

#### Returns

`Promise`\<`TResult`\>

The created record.

---

### createMany()

```ts
protected createMany<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:240](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L240)

Creates multiple records.

#### Type Parameters

| Type Parameter                                  | Default type                |
| ----------------------------------------------- | --------------------------- |
| <a id="type-parameter-tresult-3"></a> `TResult` | `TReturn`\[`"createMany"`\] |

#### Parameters

| Parameter | Type                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| `args`    | `TArgs`\[`"createMany"`\] | The arguments to create the records. |

#### Returns

`Promise`\<`TResult`\>

The created records.

---

### delete()

```ts
protected delete<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:288](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L288)

Deletes a record by its identifier.

#### Type Parameters

| Type Parameter                                  | Default type            |
| ----------------------------------------------- | ----------------------- |
| <a id="type-parameter-tresult-4"></a> `TResult` | `TReturn`\[`"delete"`\] |

#### Parameters

| Parameter | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"delete"`\] | The arguments to delete the record. |

#### Returns

`Promise`\<`TResult`\>

The deleted record.

---

### deleteMany()

```ts
protected deleteMany<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:300](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L300)

Deletes multiple records by their identifiers.

#### Type Parameters

| Type Parameter                                  | Default type                |
| ----------------------------------------------- | --------------------------- |
| <a id="type-parameter-tresult-5"></a> `TResult` | `TReturn`\[`"deleteMany"`\] |

#### Parameters

| Parameter | Type                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| `args`    | `TArgs`\[`"deleteMany"`\] | The arguments to delete the records. |

#### Returns

`Promise`\<`TResult`\>

The deleted records.

---

### execute()

```ts
execute<TResult>(query): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:134](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L134)

Executes a predefined query against the underlying model.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tresult-6"></a> `TResult` |

#### Parameters

| Parameter | Type                                                                       | Description                      |
| --------- | -------------------------------------------------------------------------- | -------------------------------- |
| `query`   | [`IRepositoryQuery`](Interface.IRepositoryQuery)\<`TDelegate`, `TResult`\> | The query definition to execute. |

#### Returns

`Promise`\<`TResult`\>

The query result.

---

### executeTransactional()

```ts
executeTransactional<TResult>(query): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:146](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L146)

Executes a transactional query providing a Prisma TransactionClient for multi-model work.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tresult-7"></a> `TResult` |

#### Parameters

| Parameter | Type                                                                                    | Description                                    |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `query`   | [`ITransactionalRepositoryQuery`](Interface.ITransactionalRepositoryQuery)\<`TResult`\> | The transactional query definition to execute. |

#### Returns

`Promise`\<`TResult`\>

The query result.

---

### findFirst()

```ts
protected findFirst<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:203](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L203)

Finds the first record that matches the criteria.

#### Type Parameters

| Type Parameter                                  | Default type               |
| ----------------------------------------------- | -------------------------- |
| <a id="type-parameter-tresult-8"></a> `TResult` | `TReturn`\[`"findFirst"`\] |

#### Parameters

| Parameter | Type                     | Description                             |
| --------- | ------------------------ | --------------------------------------- |
| `args`    | `TArgs`\[`"findFirst"`\] | The arguments to find the first record. |

#### Returns

`Promise`\<`TResult`\>

The found record or null if not found.

---

### findFirstOrThrow()

```ts
protected findFirstOrThrow<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:216](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L216)

Finds the first record that matches the criteria or throws if not found.

#### Type Parameters

| Type Parameter                                  | Default type                      |
| ----------------------------------------------- | --------------------------------- |
| <a id="type-parameter-tresult-9"></a> `TResult` | `TReturn`\[`"findFirstOrThrow"`\] |

#### Parameters

| Parameter | Type                            | Description                             |
| --------- | ------------------------------- | --------------------------------------- |
| `args`    | `TArgs`\[`"findFirstOrThrow"`\] | The arguments to find the first record. |

#### Returns

`Promise`\<`TResult`\>

The found record.

#### Throws

PrismaClientKnownRequestError with code P2025 if no record matches.

---

### findMany()

```ts
findMany<TResult>(args?, page?): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:184](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L184)

Finds multiple records with optional pagination.

#### Type Parameters

| Type Parameter                                   | Default type              |
| ------------------------------------------------ | ------------------------- |
| <a id="type-parameter-tresult-10"></a> `TResult` | `TReturn`\[`"findMany"`\] |

#### Parameters

| Parameter | Type                                                           | Description                        |
| --------- | -------------------------------------------------------------- | ---------------------------------- |
| `args?`   | `TArgs`\[`"findMany"`\]                                        | The arguments to find the records. |
| `page?`   | `Required`\<[`IPaginateOptions`](Interface.IPaginateOptions)\> | The pagination options.            |

#### Returns

`Promise`\<`TResult`\>

The found records.

---

### findUnique()

```ts
protected findUnique<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:158](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L158)

Finds a unique record by its identifier.

#### Type Parameters

| Type Parameter                                   | Default type                |
| ------------------------------------------------ | --------------------------- |
| <a id="type-parameter-tresult-11"></a> `TResult` | `TReturn`\[`"findUnique"`\] |

#### Parameters

| Parameter | Type                      | Description                              |
| --------- | ------------------------- | ---------------------------------------- |
| `args`    | `TArgs`\[`"findUnique"`\] | The arguments to find the unique record. |

#### Returns

`Promise`\<`TResult`\>

The found record or null if not found.

---

### findUniqueOrThrow()

```ts
protected findUniqueOrThrow<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:171](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L171)

Finds a unique record by its identifier or throws if not found.

#### Type Parameters

| Type Parameter                                   | Default type                       |
| ------------------------------------------------ | ---------------------------------- |
| <a id="type-parameter-tresult-12"></a> `TResult` | `TReturn`\[`"findUniqueOrThrow"`\] |

#### Parameters

| Parameter | Type                             | Description                              |
| --------- | -------------------------------- | ---------------------------------------- |
| `args`    | `TArgs`\[`"findUniqueOrThrow"`\] | The arguments to find the unique record. |

#### Returns

`Promise`\<`TResult`\>

The found record.

#### Throws

PrismaClientKnownRequestError with code P2025 if the record does not exist.

---

### groupBy()

```ts
protected groupBy<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:336](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L336)

Groups records by specified fields and performs aggregations.

#### Type Parameters

| Type Parameter                                   | Default type             |
| ------------------------------------------------ | ------------------------ |
| <a id="type-parameter-tresult-13"></a> `TResult` | `TReturn`\[`"groupBy"`\] |

#### Parameters

| Parameter | Type                   | Description                         |
| --------- | ---------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"groupBy"`\] | The arguments to group the records. |

#### Returns

`Promise`\<`TResult`\>

The grouped records with aggregations.

---

### merge()

```ts
protected merge<TResult>(entity): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:348](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L348)

Merges the given `data` with the user identified by the `id`.

#### Type Parameters

| Type Parameter                                   | Default type            |
| ------------------------------------------------ | ----------------------- |
| <a id="type-parameter-tresult-14"></a> `TResult` | `TReturn`\[`"update"`\] |

#### Parameters

| Parameter | Type                                           |
| --------- | ---------------------------------------------- |
| `entity`  | `Partial`\<`TEntity`\> & \{ `id`: `string`; \} |

#### Returns

`Promise`\<`TResult`\>

The merged data.

---

### tryCatch()

```ts
protected tryCatch<T>(promise): Promise<T>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:387](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L387)

Wraps a promise in a try-catch block to handle errors uniformly.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type             | Description          |
| --------- | ---------------- | -------------------- |
| `promise` | `Promise`\<`T`\> | The promise to wrap. |

#### Returns

`Promise`\<`T`\>

The result of the promise or throws an error.

#### Remarks

Prisma request errors become a [RepositoryError](Class.RepositoryError) whose `kind`
classifies the failure, for example a unique constraint violation.
Every other error is rethrown unchanged.

---

### update()

```ts
protected update<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:252](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L252)

Updates an existing record.

#### Type Parameters

| Type Parameter                                   | Default type            |
| ------------------------------------------------ | ----------------------- |
| <a id="type-parameter-tresult-15"></a> `TResult` | `TReturn`\[`"update"`\] |

#### Parameters

| Parameter | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"update"`\] | The arguments to update the record. |

#### Returns

`Promise`\<`TResult`\>

The updated record.

---

### updateMany()

```ts
protected updateMany<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:264](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L264)

Updates multiple existing records.

#### Type Parameters

| Type Parameter                                   | Default type                |
| ------------------------------------------------ | --------------------------- |
| <a id="type-parameter-tresult-16"></a> `TResult` | `TReturn`\[`"updateMany"`\] |

#### Parameters

| Parameter | Type                      | Description                          |
| --------- | ------------------------- | ------------------------------------ |
| `args`    | `TArgs`\[`"updateMany"`\] | The arguments to update the records. |

#### Returns

`Promise`\<`TResult`\>

The updated records.

---

### upsert()

```ts
protected upsert<TResult>(args): Promise<TResult>;
```

Defined in: [libs/platform-database/src/repositories/abstracts/RepositoryBase.ts:276](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories/abstracts/RepositoryBase.ts#L276)

Creates or updates a record based on its existence.

#### Type Parameters

| Type Parameter                                   | Default type            |
| ------------------------------------------------ | ----------------------- |
| <a id="type-parameter-tresult-17"></a> `TResult` | `TReturn`\[`"upsert"`\] |

#### Parameters

| Parameter | Type                  | Description                         |
| --------- | --------------------- | ----------------------------------- |
| `args`    | `TArgs`\[`"upsert"`\] | The arguments to upsert the record. |

#### Returns

`Promise`\<`TResult`\>

The created or updated record.
