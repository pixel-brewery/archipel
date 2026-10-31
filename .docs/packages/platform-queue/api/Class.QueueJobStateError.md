---
title: 'Class: QueueJobStateError'
generated: true
editUrl: false
---

# Class: QueueJobStateError

Defined in: [libs/platform-queue/src/errors/QueueJobStateError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueJobStateError.ts#L15)

Thrown when a queue job is in an invalid state for the requested transition.

For example, calling [IQueue.markCompleted](Interface.IQueue#markcompleted) on a job that is still
in `pending` status rather than `processing` triggers this error.

## Extends

- [`QueueError`](Class.QueueError)

## Constructors

### Constructor

```ts
new QueueJobStateError(
   jobId,
   expectedStatus,
   actualStatus
): QueueJobStateError;
```

Defined in: [libs/platform-queue/src/errors/QueueJobStateError.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueJobStateError.ts#L25)

Creates a new QueueJobStateError.

#### Parameters

| Parameter        | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `jobId`          | `string` | The identifier of the affected job.               |
| `expectedStatus` | `string` | The status required for the attempted transition. |
| `actualStatus`   | `string` | The current status of the job.                    |

#### Returns

`QueueJobStateError`

#### Overrides

[`QueueError`](Class.QueueError).[`constructor`](Class.QueueError#constructor)
