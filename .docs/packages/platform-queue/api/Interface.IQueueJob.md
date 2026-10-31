---
title: 'Interface: IQueueJob\<TPayload\>'
generated: true
editUrl: false
---

# Interface: IQueueJob\<TPayload\>

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L37)

Represents a job in a named queue with tracking metadata.

All queue implementations return objects conforming to this interface,
making it the unified exchange type between producers and consumers.

## Type Parameters

| Type Parameter                                  | Default type | Description                                         |
| ----------------------------------------------- | ------------ | --------------------------------------------------- |
| <a id="type-parameter-tpayload"></a> `TPayload` | `unknown`    | The type of the job payload. Defaults to `unknown`. |

## Properties

### attempts

```ts
readonly attempts: number;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L51)

Number of processing attempts.

---

### completedAt

```ts
readonly completedAt: Date | null;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L60)

Timestamp when the job completed successfully.

---

### createdAt

```ts
readonly createdAt: Date;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L54)

Timestamp when the job was created.

---

### errorMessage

```ts
readonly errorMessage: string | null;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L66)

Error message from the last failure, if any.

---

### failedAt

```ts
readonly failedAt: Date | null;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L63)

Timestamp when the job last failed.

---

### id

```ts
readonly id: string;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L39)

Unique job identifier.

---

### payload

```ts
readonly payload: TPayload;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L45)

The job payload.

---

### queueName

```ts
readonly queueName: string;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L42)

Name of the queue this job belongs to.

---

### startedAt

```ts
readonly startedAt: Date | null;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L57)

Timestamp when the job was last picked up for processing.

---

### status

```ts
readonly status: QueueJobStatus;
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L48)

Current status of the job.
