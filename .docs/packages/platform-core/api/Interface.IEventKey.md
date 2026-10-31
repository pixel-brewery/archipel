---
title: 'Interface: IEventKey\<TEvents, TKey\>'
generated: true
editUrl: false
---

# Interface: IEventKey\<TEvents, TKey\>

Defined in: [libs/platform-core/src/events/EventKey.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L12)

Represents a strongly typed event key that encodes the payload type.

## Type Parameters

| Type Parameter                                                                             |
| ------------------------------------------------------------------------------------------ |
| <a id="type-parameter-tevents"></a> `TEvents` _extends_ [`IEventMap`](Interface.IEventMap) |
| <a id="type-parameter-tkey"></a> `TKey` _extends_ keyof `TEvents`                          |

## Properties

### \_brand

```ts
readonly _brand: "EventKey";
```

Defined in: [libs/platform-core/src/events/EventKey.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L13)

---

### \_events

```ts
readonly _events: TEvents;
```

Defined in: [libs/platform-core/src/events/EventKey.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L14)

---

### \_payload

```ts
readonly _payload: TEvents[TKey];
```

Defined in: [libs/platform-core/src/events/EventKey.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L15)

---

### event

```ts
readonly event: TKey;
```

Defined in: [libs/platform-core/src/events/EventKey.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/events/EventKey.ts#L16)
