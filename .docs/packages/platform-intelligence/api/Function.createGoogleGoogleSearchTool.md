---
title: 'Function: createGoogleGoogleSearchTool()'
generated: true
editUrl: false
---

# Function: createGoogleGoogleSearchTool()

```ts
function createGoogleGoogleSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleGoogleSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleGoogleSearchTool.ts#L19)

Creates a Google Search grounding tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                 |
| ---------- | ------------------------------------------------------------------------------ | --------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google Search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
