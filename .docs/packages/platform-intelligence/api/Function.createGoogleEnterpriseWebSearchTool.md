---
title: 'Function: createGoogleEnterpriseWebSearchTool()'
generated: true
editUrl: false
---

# Function: createGoogleEnterpriseWebSearchTool()

```ts
function createGoogleEnterpriseWebSearchTool(options?): Promise<IIntelligenceTool>;
```

Defined in: [libs/platform-intelligence/src/providers/google/tools/createGoogleEnterpriseWebSearchTool.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/providers/google/tools/createGoogleEnterpriseWebSearchTool.ts#L19)

Creates a Google enterprise-web-search tool registration.

## Parameters

| Parameter  | Type                                                                           | Description                                |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| `options?` | [`IntelligenceProviderToolOptions`](TypeAlias.IntelligenceProviderToolOptions) | Google enterprise-web-search tool options. |

## Returns

`Promise`\<[`IIntelligenceTool`](Interface.IIntelligenceTool)\>

Tool registration compatible with the intelligence tool registry.
