---
title: '~~Function: createAnthropicTextEditor20250429Tool()~~'
generated: true
editUrl: false
---

# ~~Function: createAnthropicTextEditor20250429Tool()~~

```ts
function createAnthropicTextEditor20250429Tool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20250429Tool.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/anthropic/tools/createAnthropicTextEditor20250429Tool.ts#L21)

Creates an Anthropic text-editor tool registration for the 2025-04-29 version.

## Parameters

| Parameter  | Type                                                                           | Description                         |
| ---------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Anthropic text-editor tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.

## Deprecated

The AI SDK deprecates `textEditor_20250429`; use `createAnthropicTextEditor20250728Tool`.
