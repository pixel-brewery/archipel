---
title: 'Variable: AUTH\_MICROSOFT\_STATE'
generated: true
editUrl: false
---

# Variable: AUTH\_MICROSOFT\_STATE

```ts
const AUTH_MICROSOFT_STATE: IConfigKey<string>;
```

Defined in: [libs/platform-authentication/src/env.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/env.ts#L85)

Whether to enable the OAuth `state` parameter for CSRF protection on the Microsoft connector.
Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
(`'false'`) for stateless / serverless environments without a shared session store.
