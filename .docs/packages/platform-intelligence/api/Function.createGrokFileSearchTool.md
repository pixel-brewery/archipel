---
title: 'Function: createGrokFileSearchTool()'
generated: true
editUrl: false
---

# Function: createGrokFileSearchTool()

```ts
function createGrokFileSearchTool(options): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokFileSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokFileSearchTool.ts#L19)

Creates a Grok file-search tool registration.

## Parameters

| Parameter | Type                                                                           | Description                    |
| --------- | ------------------------------------------------------------------------------ | ------------------------------ |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok file-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
