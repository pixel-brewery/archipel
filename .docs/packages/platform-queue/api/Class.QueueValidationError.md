---
title: 'Class: QueueValidationError'
generated: true
editUrl: false
---

# Class: QueueValidationError

Defined in: [libs/platform-queue/src/errors/QueueValidationError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueValidationError.ts#L15)

Thrown when a queue operation receives invalid input.

Common triggers include an empty or whitespace-only queue name,
or an empty error message passed to [IQueue.markFailed](Interface.IQueue#markfailed).

## Extends

- [`QueueError`](Class.QueueError)

## Constructors

### Constructor

```ts
new QueueValidationError(message): QueueValidationError;
```

Defined in: [libs/platform-queue/src/errors/QueueValidationError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueValidationError.ts#L23)

Creates a new QueueValidationError.

#### Parameters

| Parameter | Type     | Description                                             |
| --------- | -------- | ------------------------------------------------------- |
| `message` | `string` | A human-readable description of the validation failure. |

#### Returns

`QueueValidationError`

#### Overrides

[`QueueError`](Class.QueueError).[`constructor`](Class.QueueError#constructor)
