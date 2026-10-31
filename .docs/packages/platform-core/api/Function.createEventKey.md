---
title: 'Function: createEventKey()'
generated: true
editUrl: false
---

# Function: createEventKey()

```ts
function createEventKey<TEvents, TKey>(eventName): IEventKey<TEvents, TKey>;
```

Defined in: [libs/platform-core/src/events/EventKey.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L26)

Creates a branded event key for the [EventHub](Class.EventHub).

## Type Parameters

| Type Parameter                                                                             |
| ------------------------------------------------------------------------------------------ |
| <a id="type-parameter-tevents"></a> `TEvents` _extends_ [`IEventMap`](Interface.IEventMap) |
| <a id="type-parameter-tkey"></a> `TKey` _extends_ `string` \| `number` \| `symbol`         |

## Parameters

| Parameter   | Type   | Description                   |
| ----------- | ------ | ----------------------------- |
| `eventName` | `TKey` | The unique name of the event. |

## Returns

[`IEventKey`](Interface.IEventKey)\<`TEvents`, `TKey`\>

The branded event key encoding the payload type.
