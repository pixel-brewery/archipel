---
title: 'Abstract Class: Repository2Base\<TDelegate\>'
generated: true
editUrl: false
---

# Abstract Class: Repository2Base\<TDelegate\>

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L15)

**`Beta`**

Minimal repository base that exposes the underlying Prisma delegate and
provides a typed pipe helper for functional operators.

## Type Parameters

| Type Parameter                                    | Description                                                  |
| ------------------------------------------------- | ------------------------------------------------------------ |
| <a id="type-parameter-tdelegate"></a> `TDelegate` | The concrete Prisma delegate type (e.g. Prisma.UserDelegate) |

## Constructors

### Constructor

```ts
new Repository2Base<TDelegate>(db, delegate): Repository2Base<TDelegate>;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L36)

**`Beta`**

Constructs a new instance of the repository.

#### Parameters

| Parameter  | Type                                       |
| ---------- | ------------------------------------------ |
| `db`       | [`DatabaseService`](Class.DatabaseService) |
| `delegate` | `unknown`                                  |

#### Returns

`Repository2Base`\<`TDelegate`\>

#### Remarks

The `delegate` parameter is typed as `unknown` and cast internally to
`TDelegate`. This avoids `GlobalOmitOptions` mismatches introduced in
Prisma 7 where `PrismaClient` instantiates delegates with
`PrismaClientOptions` while consumer code references them with the
default `{}`.

## Accessors

### database

#### Get Signature

```ts
get protected database(): DatabaseService;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L52)

**`Beta`**

Provides access to the underlying DatabaseService for derived repositories.
Only to be used for transactional orchestration that spans multiple models.

##### Returns

[`DatabaseService`](Class.DatabaseService)

---

### delegate

#### Get Signature

```ts
get protected delegate(): TDelegate;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L63)

**`Beta`**

Provides direct access to the underlying Prisma model delegate.
Use with caution, as this bypasses any repository-level logic.

##### Returns

`TDelegate`

## Methods

### execute()

```ts
execute<TRun>(query): Promise<UnwrapPromise<ReturnType<TRun>>>;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L87)

Executes an query and preserves full inferred return type.
Always returns a Promise of the unwrapped result, regardless of whether the underlying run is sync or async.

#### Type Parameters

| Type Parameter                                                              |
| --------------------------------------------------------------------------- |
| <a id="type-parameter-trun"></a> `TRun` _extends_ (`delegate`) => `unknown` |

#### Parameters

| Parameter | Type                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `query`   | [`IRepositoryQuery2`](Interface.IRepositoryQuery2)\<`TDelegate`, `TRun`\> |

#### Returns

`Promise`\<`UnwrapPromise`\<`ReturnType`\<`TRun`\>\>\>

---

### pipe()

```ts
pipe<R>(op): R;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L77)

Executes a single operator against this repository's delegate.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-r"></a> `R` |

#### Parameters

| Parameter | Type                                | Description         |
| --------- | ----------------------------------- | ------------------- |
| `op`      | `QueryOperator`\<`TDelegate`, `R`\> | Repository operator |

#### Returns

`R`

---

### tryCatch()

```ts
protected tryCatch<T>(promise): Promise<T>;
```

Defined in: [libs/platform-database/src/repositories2/abstracts/Repository2Base.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/repositories2/abstracts/Repository2Base.ts#L97)

**`Beta`**

Uniform error wrapping utility for promise-returning functions.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `promise` | `Promise`\<`T`\> |

#### Returns

`Promise`\<`T`\>
