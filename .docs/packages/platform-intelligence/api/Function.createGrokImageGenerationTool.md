---
title: 'Function: createGrokImageGenerationTool()'
generated: true
editUrl: false
---

# Function: createGrokImageGenerationTool()

```ts
function createGrokImageGenerationTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokImageGenerationTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokImageGenerationTool.ts#L19)

Creates a Grok image-generation tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok image-generation tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
