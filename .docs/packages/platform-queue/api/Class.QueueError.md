---
title: 'Class: QueueError'
generated: true
editUrl: false
---

# Class: QueueError

Defined in: [libs/platform-queue/src/errors/QueueError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueError.ts#L9)

Base error class for all queue-related errors.

Every domain-specific queue error (validation, not-found, state) extends
this class so consumers can catch the entire hierarchy with a single type.

## Extends

- `Error`

## Extended by

- [`QueueJobNotFoundError`](Class.QueueJobNotFoundError)
- [`QueueJobStateError`](Class.QueueJobStateError)
- [`QueueValidationError`](Class.QueueValidationError)

## Constructors

### Constructor

```ts
new QueueError(message): QueueError;
```

Defined in: [libs/platform-queue/src/errors/QueueError.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueError.ts#L17)

Creates a new QueueError.

#### Parameters

| Parameter | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `message` | `string` | A human-readable description of the error. |

#### Returns

`QueueError`

#### Overrides

`Error.constructor`
