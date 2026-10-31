---
title: 'Variable: QUEUE\_JOB\_STATUS'
generated: true
editUrl: false
---

# Variable: QUEUE\_JOB\_STATUS

```ts
const QUEUE_JOB_STATUS: {
    completed: 'completed';
    failed: 'failed';
    pending: 'pending';
    processing: 'processing';
};
```

Defined in: [libs/platform-queue/src/models/IQueueJob.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L10)

Possible statuses of a queue job.

Use as a const object and derive the union type via [QueueJobStatus](TypeAlias.QueueJobStatus).

## Type Declaration

| Name                                          | Type           | Default value  | Description                                   | Defined in                                                                                                                                            |
| --------------------------------------------- | -------------- | -------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-completed"></a> `completed`   | `"completed"`  | `'completed'`  | Job finished successfully.                    | [libs/platform-queue/src/models/IQueueJob.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L16) |
| <a id="property-failed"></a> `failed`         | `"failed"`     | `'failed'`     | Job finished with an error.                   | [libs/platform-queue/src/models/IQueueJob.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L18) |
| <a id="property-pending"></a> `pending`       | `"pending"`    | `'pending'`    | Job is waiting to be picked up.               | [libs/platform-queue/src/models/IQueueJob.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L12) |
| <a id="property-processing"></a> `processing` | `"processing"` | `'processing'` | Job has been dequeued and is being processed. | [libs/platform-queue/src/models/IQueueJob.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/models/IQueueJob.ts#L14) |
