---
title: 'Function: createGoogleVertexRagStoreTool()'
generated: true
editUrl: false
---

# Function: createGoogleVertexRagStoreTool()

```ts
function createGoogleVertexRagStoreTool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleVertexRagStoreTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleVertexRagStoreTool.ts#L19)

Creates a Google Vertex RAG Store tool registration.

## Parameters

| Parameter | Type                                                                           | Description                           |
| --------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google Vertex RAG Store tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
