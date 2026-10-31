---
title: 'Function: useSession()'
generated: true
editUrl: false
---

# Function: useSession()

```ts
function useSession<TApplication>(options?): PlatformBootstrapStep<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/session/useSession.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/session/useSession.ts#L16)

Creates an Express-compatible session bootstrap step.

## Type Parameters

| Type Parameter                                                                                | Default type                |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> |

## Parameters

| Parameter  | Type                                                   | Description                 |
| ---------- | ------------------------------------------------------ | --------------------------- |
| `options?` | [`ISessionStepOptions`](Interface.ISessionStepOptions) | Session middleware options. |

## Returns

[`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\>

A platform bootstrap step.
