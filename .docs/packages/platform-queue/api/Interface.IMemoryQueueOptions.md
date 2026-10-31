---
title: 'Interface: IMemoryQueueOptions'
generated: true
editUrl: false
---

# Interface: IMemoryQueueOptions

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L17)

Configuration options for [MemoryQueue](Class.MemoryQueue).

## Properties

### maxJobs?

```ts
maxJobs?: number;
```

Defined in: [libs/platform-queue/src/memory/MemoryQueue.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/memory/MemoryQueue.ts#L29)

Maximum number of jobs retained across all queues.

When the limit is exceeded, the oldest completed or failed jobs
are evicted first. Defaults to `10_000`.

#### Default Value

```ts
10_000
@public
```
