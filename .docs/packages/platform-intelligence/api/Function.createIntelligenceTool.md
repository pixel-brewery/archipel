---
title: 'Function: createIntelligenceTool()'
generated: true
editUrl: false
---

# Function: createIntelligenceTool()

```ts
function createIntelligenceTool(name, tool): IIntelligenceTool;
```

Defined in: [libs/platform-intelligence/src/tools/createIntelligenceTool.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/tools/createIntelligenceTool.ts#L17)

Creates an Archipel intelligence tool registration.

## Parameters

| Parameter | Type                                                                   | Description                                   |
| --------- | ---------------------------------------------------------------------- | --------------------------------------------- |
| `name`    | `string`                                                               | Tool name used as key in the AI SDK tool set. |
| `tool`    | [`IIntelligenceToolDefinition`](Interface.IIntelligenceToolDefinition) | Provider-neutral tool definition.             |

## Returns

[`IIntelligenceTool`](Interface.IIntelligenceTool)

Tool registration compatible with [IIntelligenceToolRegistry](Interface.IIntelligenceToolRegistry).
