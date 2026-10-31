---
title: 'Function: createGrokViewXVideoTool()'
generated: true
editUrl: false
---

# Function: createGrokViewXVideoTool()

```ts
function createGrokViewXVideoTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/grok/tools/createGrokViewXVideoTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/grok/tools/createGrokViewXVideoTool.ts#L19)

Creates a Grok X-video understanding tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                              |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Grok X-video understanding tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
