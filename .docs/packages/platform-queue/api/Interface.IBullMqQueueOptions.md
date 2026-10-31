---
title: 'Interface: IBullMqQueueOptions'
generated: true
editUrl: false
---

# Interface: IBullMqQueueOptions

Defined in: [libs/platform-queue/src/bullmq/BullMqQueue.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/bullmq/BullMqQueue.ts#L20)

Configuration options for [BullMqQueue](Class.BullMqQueue).

## Properties

### prefix?

```ts
prefix?: string;
```

Defined in: [libs/platform-queue/src/bullmq/BullMqQueue.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/bullmq/BullMqQueue.ts#L37)

Optional prefix applied to all BullMQ queue keys in Redis.

#### Default Value

`''`

---

### redisUrl

```ts
redisUrl: string;
```

Defined in: [libs/platform-queue/src/bullmq/BullMqQueue.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/bullmq/BullMqQueue.ts#L29)

Redis connection URL.

#### Example

```ts
`redis://localhost:6379`
@public
```
