---
title: 'Variable: BULLMQ\_CONFIG\_ENTRIES'
generated: true
editUrl: false
---

# Variable: BULLMQ\_CONFIG\_ENTRIES

```ts
const BULLMQ_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
```

Defined in: [libs/platform-queue/src/bullmq/env.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/bullmq/env.ts#L39)

All configuration entries required by the BullMQ queue provider.

Pass this array to the module's `register()` method so that the
configuration service validates and provides the values at startup.
