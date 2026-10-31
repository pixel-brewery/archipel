---
title: 'Function: createOpenAICustomTool()'
generated: true
editUrl: false
---

# Function: createOpenAICustomTool()

```ts
function createOpenAICustomTool(options, name): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAICustomTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAICustomTool.ts#L19)

Creates an OpenAI custom provider-defined tool registration.

## Parameters

| Parameter | Type                                                                           | Description                      |
| --------- | ------------------------------------------------------------------------------ | -------------------------------- |
| `options` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | OpenAI custom tool options.      |
| `name`    | `string`                                                                       | Optional Archipel registry name. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
