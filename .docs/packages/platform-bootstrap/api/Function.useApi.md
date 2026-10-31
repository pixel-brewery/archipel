---
title: 'Function: useApi()'
generated: true
editUrl: false
---

# Function: useApi()

```ts
function useApi<TApplication>(options?): PlatformBootstrapStep<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/steps/useApi.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/steps/useApi.ts#L24)

Creates the generic Archipel API bootstrap step.

## Type Parameters

| Type Parameter                                                                                | Default type                |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> |

## Parameters

| Parameter  | Type                                           | Description            |
| ---------- | ---------------------------------------------- | ---------------------- |
| `options?` | [`IApiStepOptions`](Interface.IApiStepOptions) | API bootstrap options. |

## Returns

[`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\>

A platform bootstrap step.
