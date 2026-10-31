---
title: 'Class: VercelQueue'
generated: true
editUrl: false
---

# Class: VercelQueue

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:117](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L117)

Vercel Queues implementation of the [IQueue](Interface.IQueue) contract.

Uses the official `@vercel/queue` SDK (`PollingQueueClient`) for
durable, serverless message streaming. Messages are published to
topics and consumed via poll-based consumer groups.

## Remarks

This adapter maps the topic/consumer-group model to the
[IQueue](Interface.IQueue) interface by treating topic names as queue names.

[dequeue](#dequeue) calls `receive()` on the SDK. The handler callback
is suspended via an internal gate promise until
[markCompleted](#markcompleted) or [markFailed](#markfailed) is invoked, at which
point the handler completes and the SDK auto-acknowledges the
message. This gives callers explicit control over the job lifecycle
while relying on the SDK for authentication, serialisation, and
visibility-timeout extension.

Both [markCompleted](#markcompleted) and [markFailed](#markfailed) acknowledge
(remove) the message. If retry behaviour is desired, re-enqueue
the job explicitly.

## Implements

- [`IQueue`](Interface.IQueue)
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new VercelQueue(options): VercelQueue;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:157](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L157)

Creates a new VercelQueue instance.

#### Parameters

| Parameter | Type                                                   | Description                                                                                                       |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `options` | [`IVercelQueueOptions`](Interface.IVercelQueueOptions) | Region, consumer group, and optional SDK configuration. See [IVercelQueueOptions](Interface.IVercelQueueOptions). |

#### Returns

`VercelQueue`

## Methods

### dequeue()

```ts
dequeue(queueName): Promise<IQueueJob<unknown> | null>;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:199](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L199)

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

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:172](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L172)

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

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:321](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L321)

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

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:245](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L245)

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

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:280](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L280)

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

---

### onModuleDestroy()

```ts
onModuleDestroy(): Promise<void>;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:336](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L336)

Releases all pending gates and clears internal tracking maps.

Releasing the gates causes pending SDK handlers to complete
normally, acknowledging in-flight messages. This prevents
dangling handlers during graceful shutdown.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`
