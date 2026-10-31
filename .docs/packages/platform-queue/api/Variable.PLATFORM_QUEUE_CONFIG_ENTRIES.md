---
title: 'Variable: PLATFORM\_QUEUE\_CONFIG\_ENTRIES'
generated: true
editUrl: false
---

# Variable: PLATFORM\_QUEUE\_CONFIG\_ENTRIES

```ts
const PLATFORM_QUEUE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
```

Defined in: [libs/platform-queue/src/env.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/env.ts#L31)

All configuration entries required by `platform-queue`.

Pass this array to the module's `register()` method so that the
configuration service validates and provides the values at startup.
