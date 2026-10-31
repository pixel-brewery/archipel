---
title: 'Function: useExpressServer()'
generated: true
editUrl: false
---

# Function: useExpressServer()

```ts
function useExpressServer<TApplication>(options?): PlatformBootstrapStep<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/server/express/useExpressServer.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/server/express/useExpressServer.ts#L14)

Creates an Express-compatible server bootstrap step.

## Type Parameters

| Type Parameter                                                                                | Default type                |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> |

## Parameters

| Parameter  | Type                                                               | Description             |
| ---------- | ------------------------------------------------------------------ | ----------------------- |
| `options?` | [`IExpressServerStepOptions`](Interface.IExpressServerStepOptions) | Express server options. |

## Returns

[`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\>

A platform bootstrap step.
