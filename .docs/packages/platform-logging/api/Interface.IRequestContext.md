---
title: 'Interface: IRequestContext'
generated: true
editUrl: false
---

# Interface: IRequestContext

Defined in: [libs/platform-logging/src/RequestContextStore.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L12)

Shape of the per-request context stored in [RequestContextStore](Class.RequestContextStore).

## Properties

### requestId

```ts
readonly requestId: string;
```

Defined in: [libs/platform-logging/src/RequestContextStore.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L14)

Unique request correlation identifier.

---

### userId?

```ts
readonly userId?: string;
```

Defined in: [libs/platform-logging/src/RequestContextStore.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-logging/src/RequestContextStore.ts#L17)

Optional authenticated user identifier.
