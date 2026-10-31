---
title: 'Function: createGoogleUrlContextTool()'
generated: true
editUrl: false
---

# Function: createGoogleUrlContextTool()

```ts
function createGoogleUrlContextTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleUrlContextTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleUrlContextTool.ts#L19)

Creates a Google URL context tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                      |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google URL context tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
