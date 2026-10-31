---
title: 'Variable: AUTH\_APPLE\_STATE'
generated: true
editUrl: false
---

# Variable: AUTH\_APPLE\_STATE

```ts
const AUTH_APPLE_STATE: IConfigKey<string>;
```

Defined in: [libs/platform-authentication/src/env.ts:110](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/env.ts#L110)

Whether to enable the OAuth `state` parameter for CSRF protection on the Apple connector.
Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
(`'false'`) for stateless / serverless environments without a shared session store.
