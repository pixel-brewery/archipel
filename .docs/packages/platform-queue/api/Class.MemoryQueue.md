---
title: 'Class: MemoryQueue'
generated: true
editUrl: false
---

# Class: MemoryQueue

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L47)

In-memory FIFO queue implementation.

Stores all jobs in process memory. Suitable for development, testing,
and lightweight single-instance workloads. Data is lost on process restart.

## Remarks

Jobs are organized per named queue. Capacity enforcement evicts the oldest
completed or failed jobs when [IMemoryQueueOptions.maxJobs](Interface.IMemoryQueueOptions#maxjobs) is reached.

## Implements

- [`IQueue`](Interface.IQueue)

## Constructors

### Constructor

```ts
new MemoryQueue(options?): MemoryQueue;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:65](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L65)

Creates a new MemoryQueue instance.

#### Parameters

| Parameter  | Type                                                   | Description                                                                       |
| ---------- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `options?` | [`IMemoryQueueOptions`](Interface.IMemoryQueueOptions) | Optional configuration. See [IMemoryQueueOptions](Interface.IMemoryQueueOptions). |

#### Returns

`MemoryQueue`

## Methods

### dequeue()

```ts
dequeue(queueName): Promise<IQueueJob<unknown> | null>;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L103)

Dequeues the next pending job from the named queue.

The returned job transitions to `processing` status.

#### Parameters

| Parameter   | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| `queueName` | `string` | The name of the queue to dequeue from. |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\> \| `null`\>

The next pending job, or `null` if the queue is empty.

#### Implementation of

[`IQueue`](Interface.IQueue).[`dequeue`](Interface.IQueue#dequeue)

---

### enqueue()

```ts
enqueue<T>(queueName, payload): Promise<IQueueJob<T>>;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:74](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L74)

Enqueues a new job into the named queue.

#### Type Parameters

| Type Parameter                    | Default type | Description |
| --------------------------------- | ------------ | ----------- |
| <a id="type-parameter-t"></a> `T` | `unknown`    |             |

#### Parameters

| Parameter   | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| `queueName` | `string` | The name of the target queue. |
| `payload`   | `T`      | The job payload.              |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`T`\>\>

The created job in `pending` status.

#### Implementation of

[`IQueue`](Interface.IQueue).[`enqueue`](Interface.IQueue#enqueue)

---

### getJobs()

```ts
getJobs(queueName): Promise<readonly IQueueJob<unknown>[]>;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:188](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L188)

Returns all jobs for the given queue in insertion order.

#### Parameters

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `queueName` | `string` | The name of the queue. |

#### Returns

`Promise`\<readonly [`IQueueJob`](Interface.IQueueJob)\<`unknown`\>[]\>

An array of jobs, possibly empty.

#### Implementation of

[`IQueue`](Interface.IQueue).[`getJobs`](Interface.IQueue#getjobs)

---

### markCompleted()

```ts
markCompleted(jobId): Promise<IQueueJob<unknown>>;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:138](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L138)

Marks a processing job as completed.

#### Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `jobId`   | `string` | The ID of the job to complete. |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\>\>

The updated job in `completed` status.

#### Implementation of

[`IQueue`](Interface.IQueue).[`markCompleted`](Interface.IQueue#markcompleted)

---

### markFailed()

```ts
markFailed(jobId, errorMessage): Promise<IQueueJob<unknown>>;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:160](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L160)

Marks a processing job as failed.

#### Parameters

| Parameter      | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| `jobId`        | `string` | The ID of the job to mark as failed. |
| `errorMessage` | `string` | A human-readable error message.      |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\>\>

The updated job in `failed` status.

#### Implementation of

[`IQueue`](Interface.IQueue).[`markFailed`](Interface.IQueue#markfailed)
