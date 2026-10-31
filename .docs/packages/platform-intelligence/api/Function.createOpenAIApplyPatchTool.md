---
title: 'Function: createOpenAIApplyPatchTool()'
generated: true
editUrl: false
---

# Function: createOpenAIApplyPatchTool()

```ts
function createOpenAIApplyPatchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIApplyPatchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIApplyPatchTool.ts#L19)

Creates an OpenAI apply-patch tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                      |
| ---------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI apply-patch tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
