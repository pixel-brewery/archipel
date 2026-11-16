---
title: 'Function: createOpenAIProgrammaticToolCallingTool()'
generated: true
editUrl: false
---

# Function: createOpenAIProgrammaticToolCallingTool()

```ts
function createOpenAIProgrammaticToolCallingTool(): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/openai/tools/createOpenAIProgrammaticToolCallingTool.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/openai/tools/createOpenAIProgrammaticToolCallingTool.ts#L20)

Creates an OpenAI programmatic tool-calling registration.

Responses models write and execute JavaScript that orchestrates eligible tools. The AI SDK marks this tool as
experimental.

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
