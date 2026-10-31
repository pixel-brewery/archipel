---
title: 'Variable: VERCEL\_CONFIG\_ENTRIES'
generated: true
editUrl: false
---

# Variable: VERCEL\_CONFIG\_ENTRIES

```ts
const VERCEL_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
```

Defined in: [libs/platform-queue/src/vercel/env.ts:63](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/vercel/env.ts#L63)

All configuration entries required by the Vercel queue provider.

Pass this array to the module's `register()` method so that the
configuration service validates and provides the values at startup.
