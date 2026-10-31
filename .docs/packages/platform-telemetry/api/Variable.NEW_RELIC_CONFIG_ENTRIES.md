---
title: 'Variable: NEW\_RELIC\_CONFIG\_ENTRIES'
generated: true
editUrl: false
---

# Variable: NEW\_RELIC\_CONFIG\_ENTRIES

```ts
const NEW_RELIC_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
```

Defined in: [libs/platform-telemetry/src/measurements/providers/new-relic/env.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/providers/new-relic/env.ts#L7)

Register these entries with the host's ConfigModule before selecting the New Relic measurement sink.
