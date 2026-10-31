---
title: 'Function: createGoogleGoogleMapsTool()'
generated: true
editUrl: false
---

# Function: createGoogleGoogleMapsTool()

```ts
function createGoogleGoogleMapsTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleGoogleMapsTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleGoogleMapsTool.ts#L19)

Creates a Google Maps grounding tool registration.

## Parameters

| Parameter  | Type                                                                           | Description               |
| ---------- | ------------------------------------------------------------------------------ | ------------------------- |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google Maps tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
