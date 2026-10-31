---
title: 'Function: useOpenApi()'
generated: true
editUrl: false
---

# Function: useOpenApi()

```ts
function useOpenApi<TApplication>(options?): PlatformBootstrapStep<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/openapi/useOpenApi.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/openapi/useOpenApi.ts#L16)

Creates the Archipel OpenAPI multi-document bootstrap step.

## Type Parameters

| Type Parameter                                                                                | Default type                |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> |

## Parameters

| Parameter  | Type                                                   | Description                |
| ---------- | ------------------------------------------------------ | -------------------------- |
| `options?` | [`IOpenApiStepOptions`](Interface.IOpenApiStepOptions) | OpenAPI bootstrap options. |

## Returns

[`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\>

A platform bootstrap step.
