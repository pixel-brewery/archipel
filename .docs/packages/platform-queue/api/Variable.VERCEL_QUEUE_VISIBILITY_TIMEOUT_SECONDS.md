---
title: 'Variable: VERCEL\_QUEUE\_VISIBILITY\_TIMEOUT\_SECONDS'
generated: true
editUrl: false
---

# Variable: VERCEL\_QUEUE\_VISIBILITY\_TIMEOUT\_SECONDS

```ts
const VERCEL_QUEUE_VISIBILITY_TIMEOUT_SECONDS: IConfigKey<number>;
```

Defined in: [libs/platform-queue/src/vercel/env.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/env.ts#L42)

Visibility timeout in seconds for received messages.

The SDK automatically re-extends the lease while the handler runs.

## Default Value

```ts
300
@public
```
