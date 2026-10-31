---
title: 'Function: createGoogleCodeExecutionTool()'
generated: true
editUrl: false
---

# Function: createGoogleCodeExecutionTool()

```ts
function createGoogleCodeExecutionTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleCodeExecutionTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleCodeExecutionTool.ts#L19)

Creates a Google code-execution tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google code-execution tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
