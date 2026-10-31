---
title: 'Type Alias: PlatformBootstrapStep\<TApplication\>'
generated: true
editUrl: false
---

# Type Alias: PlatformBootstrapStep\<TApplication\>

```ts
type PlatformBootstrapStep<TApplication> = (context, next) => Promise<void> | void;
```

Defined in: [libs/platform-bootstrap/src/types/PlatformBootstrapStep.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/types/PlatformBootstrapStep.ts#L10)

A composable bootstrap step in the platform application pipeline.

## Type Parameters

| Type Parameter                                                                       | Default type       |
| ------------------------------------------------------------------------------------ | ------------------ |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication` | `INestApplication` |

## Parameters

| Parameter | Type                                                                           |
| --------- | ------------------------------------------------------------------------------ |
| `context` | [`PlatformBootstrapContext`](Class.PlatformBootstrapContext)\<`TApplication`\> |
| `next`    | [`PlatformBootstrapNext`](TypeAlias.PlatformBootstrapNext)                     |

## Returns

`Promise`\<`void`\> \| `void`
