---
title: 'Variable: VERCEL\_QUEUE\_TOKEN'
generated: true
editUrl: false
---

# Variable: VERCEL\_QUEUE\_TOKEN

```ts
const VERCEL_QUEUE_TOKEN: IConfigKey<string>;
```

Defined in: [libs/platform-queue/src/vercel/env.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/env.ts#L25)

Vercel OIDC bearer token for queue authentication.

When omitted the SDK auto-fetches a token via OIDC.
