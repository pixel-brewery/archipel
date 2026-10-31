---
title: 'Function: createGrokCodeExecutionTool()'
generated: true
editUrl: false
---

# Function: createGrokCodeExecutionTool()

```ts
function createGrokCodeExecutionTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokCodeExecutionTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokCodeExecutionTool.ts#L19)

Creates a Grok code-execution tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                       |
| ---------- | ------------------------------------------------------------------------------ | --------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok code-execution tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
