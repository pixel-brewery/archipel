---
title: 'Interface: IVercelQueueOptions'
generated: true
editUrl: false
---

# Interface: IVercelQueueOptions

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L35)

Configuration options for [VercelQueue](Class.VercelQueue).

## Properties

### consumerGroup

```ts
consumerGroup: string;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L55)

Consumer group name used when receiving messages.

Each consumer group independently tracks its position in the topic.

---

### deploymentId?

```ts
deploymentId?: string | null;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L75)

Deployment ID for per-deployment message isolation.

- `undefined` — auto-detected from `VERCEL_DEPLOYMENT_ID` (pinned).
- `null` — unpinned (messages shared across deployments).
- Explicit string — pinned to the given deployment.

---

### region

```ts
region: string;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L46)

Vercel region code (e.g. `iad1`, `fra1`, `sfo1`).

Required — messages can only be consumed from the region they were
sent to. Use a fixed region for both sending and receiving.

---

### token?

```ts
token?: string;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:64](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L64)

Vercel OIDC bearer token for authentication.

When omitted the SDK auto-fetches a token via OIDC.

---

### visibilityTimeoutSeconds?

```ts
visibilityTimeoutSeconds?: number;
```

Defined in: [libs/platform-queue/src/vercel/VercelQueue.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/VercelQueue.ts#L86)

Visibility timeout in seconds for received messages.

The SDK automatically re-extends the lease while the handler is
running, so the default of 300 s is suitable for most workloads.

#### Default Value

```ts
300
@public
```
