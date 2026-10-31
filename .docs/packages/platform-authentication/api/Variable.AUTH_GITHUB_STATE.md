---
title: 'Variable: AUTH\_GITHUB\_STATE'
generated: true
editUrl: false
---

# Variable: AUTH\_GITHUB\_STATE

```ts
const AUTH_GITHUB_STATE: IConfigKey<string>;
```

Defined in: [libs/platform-authentication/src/env.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/env.ts#L129)

Whether to enable the OAuth `state` parameter for CSRF protection on the GitHub connector.
Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
(`'false'`) for stateless / serverless environments without a shared session store.
