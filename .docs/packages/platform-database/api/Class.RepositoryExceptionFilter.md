---
title: 'Class: RepositoryExceptionFilter'
generated: true
editUrl: false
---

# Class: RepositoryExceptionFilter

Defined in: [libs/platform-database/src/filters/RepositoryExceptionFilter.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/filters/RepositoryExceptionFilter.ts#L15)

Represents the Prisma client exception filter.

## Implements

- `ExceptionFilter`\<[`RepositoryError`](Class.RepositoryError)\>

## Constructors

### Constructor

```ts
new RepositoryExceptionFilter(): RepositoryExceptionFilter;
```

#### Returns

`RepositoryExceptionFilter`

## Methods

### catch()

```ts
catch(_exception, host): void;
```

Defined in: [libs/platform-database/src/filters/RepositoryExceptionFilter.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/filters/RepositoryExceptionFilter.ts#L25)

Catches the exception.

#### Parameters

| Parameter    | Type                                       | Description |
| ------------ | ------------------------------------------ | ----------- |
| `_exception` | [`RepositoryError`](Class.RepositoryError) | -           |
| `host`       | `ArgumentsHost`                            | The host.   |

#### Returns

`void`

#### Implementation of

`ExceptionFilter.catch`
