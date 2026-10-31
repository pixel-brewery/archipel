---
title: 'Function: createGrokXSearchTool()'
generated: true
editUrl: false
---

# Function: createGrokXSearchTool()

```ts
function createGrokXSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokXSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokXSearchTool.ts#L19)

Creates a Grok X-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                 |
| ---------- | ------------------------------------------------------------------------------ | --------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok X-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
