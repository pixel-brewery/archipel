---
title: 'Function: createGrokViewImageTool()'
generated: true
editUrl: false
---

# Function: createGrokViewImageTool()

```ts
function createGrokViewImageTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokViewImageTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokViewImageTool.ts#L19)

Creates a Grok image-understanding tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                            |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok image-understanding tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
