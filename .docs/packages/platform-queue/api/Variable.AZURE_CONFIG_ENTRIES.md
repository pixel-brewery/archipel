---
title: 'Variable: AZURE\_CONFIG\_ENTRIES'
generated: true
editUrl: false
---

# Variable: AZURE\_CONFIG\_ENTRIES

```ts
const AZURE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
```

Defined in: [libs/platform-queue/src/azure/env.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-queue/src/azure/env.ts#L38)

All configuration entries required by the Azure queue provider.

Pass this array to the module's `register()` method so that the
configuration service validates and provides the values at startup.
