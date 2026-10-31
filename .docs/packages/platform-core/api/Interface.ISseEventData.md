---
title: 'Interface: ISseEventData\<TData\>'
generated: true
editUrl: false
---

# Interface: ISseEventData\<TData\>

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseEventData.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseEventData.ts#L6)

Represents the data of a Server-Sent Event.

## Type Parameters

| Type Parameter                            | Default type |
| ----------------------------------------- | ------------ |
| <a id="type-parameter-tdata"></a> `TData` | `unknown`    |

## Properties

### action

```ts
readonly action: `${string}:${string}`;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseEventData.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseEventData.ts#L9)

---

### payload

```ts
readonly payload: TData;
```

Defined in: [libs/platform-core/src/sse/services/interfaces/ISseEventData.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/sse/services/interfaces/ISseEventData.ts#L11)
