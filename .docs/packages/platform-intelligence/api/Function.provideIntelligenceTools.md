---
title: 'Function: provideIntelligenceTools()'
generated: true
editUrl: false
---

# Function: provideIntelligenceTools()

```ts
function provideIntelligenceTools(toolTypes): FactoryProvider<true>;
```

Defined in: [libs/platform-intelligence/src/tools/provideIntelligenceTools.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/tools/provideIntelligenceTools.ts#L22)

Creates a feature-owned Nest provider that contributes existing tool providers
to the application-wide intelligence registry during module bootstrap.

The returned provider has a unique token, so unrelated feature modules cannot
overwrite one another. Tool-name collisions fail closed instead of silently
replacing another feature's implementation.

## Parameters

| Parameter   | Type                                                                    | Description                                                 |
| ----------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| `toolTypes` | readonly `Type`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>[] | Tool classes already provided by the owning feature module. |

## Returns

`FactoryProvider`\<`true`\>

A Nest factory provider that registers the injected tool instances.
