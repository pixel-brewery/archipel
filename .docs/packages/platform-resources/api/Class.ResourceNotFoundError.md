---
title: 'Class: ResourceNotFoundError'
generated: true
editUrl: false
---

# Class: ResourceNotFoundError

Defined in: [libs/platform-resources/src/errors/ResourceNotFoundError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/errors/ResourceNotFoundError.ts#L6)

Error thrown when a Resource with a specified ID is not found.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new ResourceNotFoundError(key): ResourceNotFoundError;
```

Defined in: [libs/platform-resources/src/errors/ResourceNotFoundError.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/errors/ResourceNotFoundError.ts#L7)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `key`     | `string` |

#### Returns

`ResourceNotFoundError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "RESOURCE_NOT_FOUND" = 'RESOURCE_NOT_FOUND';
```

Defined in: [libs/platform-resources/src/errors/ResourceNotFoundError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/errors/ResourceNotFoundError.ts#L11)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-resources/src/errors/ResourceNotFoundError.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/errors/ResourceNotFoundError.ts#L7)
