---
title: 'Interface: IQueue\<TPayload\>'
generated: true
editUrl: false
---

# Interface: IQueue\<TPayload\>

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L23)

Contract for queue implementations.

Provides FIFO job enqueue/dequeue, status transitions, and listing.
Implementations may be in-memory, Redis-backed, or cloud-service-backed.

## Remarks

All methods are asynchronous and return [IQueueJob](Interface.IQueueJob) instances.
Errors are signalled via domain-specific exceptions:

- [QueueValidationError](Class.QueueValidationError) for invalid input.
- [QueueJobNotFoundError](Class.QueueJobNotFoundError) when a job ID cannot be resolved.
- [QueueJobStateError](Class.QueueJobStateError) when a job is in the wrong state for a transition.

## Type Parameters

| Type Parameter                                  | Default type | Description                                                             |
| ----------------------------------------------- | ------------ | ----------------------------------------------------------------------- |
| <a id="type-parameter-tpayload"></a> `TPayload` | `unknown`    | The default payload type for jobs in this queue. Defaults to `unknown`. |

## Methods

### dequeue()

```ts
dequeue(queueName): Promise<IQueueJob<unknown> | null>;
```

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L45)

Dequeues the next pending job from the named queue.

The returned job transitions to `processing` status.

#### Parameters

| Parameter   | Type     | Description                            |
| ----------- | -------- | -------------------------------------- |
| `queueName` | `string` | The name of the queue to dequeue from. |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\> \| `null`\>

The next pending job, or `null` if the queue is empty.

---

### enqueue()

```ts
enqueue<T>(queueName, payload): Promise<IQueueJob<T>>;
```

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L34)

Enqueues a new job into the named queue.

#### Type Parameters

| Type Parameter                    | Default type |
| --------------------------------- | ------------ |
| <a id="type-parameter-t"></a> `T` | `TPayload`   |

#### Parameters

| Parameter   | Type     | Description                   |
| ----------- | -------- | ----------------------------- |
| `queueName` | `string` | The name of the target queue. |
| `payload`   | `T`      | The job payload.              |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`T`\>\>

The created job in `pending` status.

---

### getJobs()

```ts
getJobs(queueName): Promise<readonly IQueueJob<unknown>[]>;
```

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L77)

Returns all jobs for the given queue in insertion order.

#### Parameters

| Parameter   | Type     | Description            |
| ----------- | -------- | ---------------------- |
| `queueName` | `string` | The name of the queue. |

#### Returns

`Promise`\<readonly [`IQueueJob`](Interface.IQueueJob)\<`unknown`\>[]\>

An array of jobs, possibly empty.

---

### markCompleted()

```ts
markCompleted(jobId): Promise<IQueueJob<unknown>>;
```

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L56)

Marks a processing job as completed.

#### Parameters

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `jobId`   | `string` | The ID of the job to complete. |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\>\>

The updated job in `completed` status.

#### Throws

[QueueJobNotFoundError](Class.QueueJobNotFoundError) When no job with the given ID exists.

#### Throws

[QueueJobStateError](Class.QueueJobStateError) When the job is not in `processing` status.

---

### markFailed()

```ts
markFailed(jobId, errorMessage): Promise<IQueueJob<unknown>>;
```

Defined in: [libs/platform-queue/src/interfaces/IQueue.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/interfaces/IQueue.ts#L68)

Marks a processing job as failed.

#### Parameters

| Parameter      | Type     | Description                          |
| -------------- | -------- | ------------------------------------ |
| `jobId`        | `string` | The ID of the job to mark as failed. |
| `errorMessage` | `string` | A human-readable error message.      |

#### Returns

`Promise`\<[`IQueueJob`](Interface.IQueueJob)\<`unknown`\>\>

The updated job in `failed` status.

#### Throws

[QueueJobNotFoundError](Class.QueueJobNotFoundError) When no job with the given ID exists.

#### Throws

[QueueJobStateError](Class.QueueJobStateError) When the job is not in `processing` status.
