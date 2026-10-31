---
title: 'Variable: AUTH\_GOOGLE\_STATE'
generated: true
editUrl: false
---

# Variable: AUTH\_GOOGLE\_STATE

```ts
const AUTH_GOOGLE_STATE: IConfigKey<string>;
```

Defined in: [libs/platform-authentication/src/env.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/env.ts#L63)

Whether to enable the OAuth `state` parameter for CSRF protection on the Google connector.
Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
(`'false'`) for stateless / serverless environments without a shared session store.
