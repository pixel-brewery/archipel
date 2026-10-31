---
title: 'Class: RepositoryError'
generated: true
editUrl: false
---

# Class: RepositoryError

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L19)

Error thrown when a repository operation fails.

## Remarks

`RepositoryBase` wraps every failed Prisma request in this error and
classifies it through [RepositoryError.kind](#kind). Inside a query callback
the raw Prisma error is still visible; `isUniqueConstraintViolation` and
`isRecordNotFound` recognize both forms.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new RepositoryError(
   message,
   originalCode?,
   meta?,
   kind?
): RepositoryError;
```

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L20)

#### Parameters

| Parameter       | Type                                                   | Default value                       |
| --------------- | ------------------------------------------------------ | ----------------------------------- |
| `message`       | `string`                                               | `undefined`                         |
| `originalCode?` | `string`                                               | `undefined`                         |
| `meta?`         | `Record`\<`string`, `unknown`\>                        | `undefined`                         |
| `kind?`         | [`RepositoryErrorKind`](TypeAlias.RepositoryErrorKind) | `RepositoryErrorKinds.Unclassified` |

#### Returns

`RepositoryError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "REPOSITORY_ERROR" = 'REPOSITORY_ERROR';
```

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L35)

---

### kind

```ts
readonly kind: RepositoryErrorKind;
```

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L40)

Why the operation failed, independent of the database driver.

---

### meta?

```ts
readonly meta?: Record<string, unknown>;
```

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L37)

---

### originalCode?

```ts
readonly originalCode?: string;
```

Defined in: [libs/platform-database/src/models/errors/RepositoryError.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-database/src/models/errors/RepositoryError.ts#L36)
