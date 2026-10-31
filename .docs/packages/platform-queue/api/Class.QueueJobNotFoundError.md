---
title: 'Class: QueueJobNotFoundError'
generated: true
editUrl: false
---

# Class: QueueJobNotFoundError

Defined in: [libs/platform-queue/src/errors/QueueJobNotFoundError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueJobNotFoundError.ts#L15)

Thrown when a queue job cannot be found by its ID.

Typically raised by [IQueue.markCompleted](Interface.IQueue#markcompleted) or [IQueue.markFailed](Interface.IQueue#markfailed)
when the supplied job identifier does not match any tracked job.

## Extends

- [`QueueError`](Class.QueueError)

## Constructors

### Constructor

```ts
new QueueJobNotFoundError(jobId): QueueJobNotFoundError;
```

Defined in: [libs/platform-queue/src/errors/QueueJobNotFoundError.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/errors/QueueJobNotFoundError.ts#L23)

Creates a new QueueJobNotFoundError.

#### Parameters

| Parameter | Type     | Description                                          |
| --------- | -------- | ---------------------------------------------------- |
| `jobId`   | `string` | The identifier of the job that could not be located. |

#### Returns

`QueueJobNotFoundError`

#### Overrides

[`QueueError`](Class.QueueError).[`constructor`](Class.QueueError#constructor)
