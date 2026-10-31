---
title: 'Class: AzureQueue'
generated: true
editUrl: false
---

# Class: AzureQueue

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L56)

Azure Service Bus queue implementation.

Uses Azure Service Bus for cloud-native, enterprise-grade messaging.
Operates in peek-lock mode: dequeued messages remain locked until
explicitly completed or dead-lettered.

## Remarks

Senders and receivers are lazily created per queue name and cached for
the lifetime of the instance. Call [onModuleDestroy](#onmoduledestroy) (handled
automatically by NestJS) to release all underlying connections.

## Implements

- [`IQueue`](Interface.IQueue)
- `OnModuleDestroy`

## Constructors

### Constructor

```ts
new AzureQueue(options): AzureQueue;
```

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L75)

Creates a new AzureQueue instance.

#### Parameters

| Parameter | Type                                                 | Description                                                                                   |
| --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `options` | [`IAzureQueueOptions`](Interface.IAzureQueueOptions) | Connection and receive configuration. See [IAzureQueueOptions](Interface.IAzureQueueOptions). |

#### Returns

`AzureQueue`

## Methods

### dequeue()

```ts
dequeue(queueName): Promise<IQueueJob<unknown> | null>;
```

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L114)

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

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L85)

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

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:221](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L221)

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

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:146](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L146)

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

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:179](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L179)

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

Defined in: [libs/platform-queue/src/azure/AzureQueue.ts:246](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/AzureQueue.ts#L246)

Closes all senders, receivers, and the underlying Service Bus client.

Called automatically by the NestJS lifecycle when the module is destroyed.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleDestroy.onModuleDestroy`
