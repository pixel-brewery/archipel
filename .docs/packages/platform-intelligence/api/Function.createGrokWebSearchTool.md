---
title: 'Function: createGrokWebSearchTool()'
generated: true
editUrl: false
---

# Function: createGrokWebSearchTool()

```ts
function createGrokWebSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokWebSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokWebSearchTool.ts#L19)

Creates a Grok web-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                   |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok web-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
