---
title: 'Function: useSecurity()'
generated: true
editUrl: false
---

# Function: useSecurity()

```ts
function useSecurity<TApplication>(options?): PlatformBootstrapStep<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/security/useSecurity.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/security/useSecurity.ts#L18)

Creates the generic security bootstrap step.

## Type Parameters

| Type Parameter                                                                                | Default type                |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> | `INestApplication`\<`any`\> |

## Parameters

| Parameter  | Type                                                     | Description                 |
| ---------- | -------------------------------------------------------- | --------------------------- |
| `options?` | [`ISecurityStepOptions`](Interface.ISecurityStepOptions) | Security bootstrap options. |

## Returns

[`PlatformBootstrapStep`](TypeAlias.PlatformBootstrapStep)\<`TApplication`\>

A platform bootstrap step.
