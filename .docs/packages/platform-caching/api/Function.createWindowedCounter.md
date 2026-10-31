---
title: 'Function: createWindowedCounter()'
generated: true
editUrl: false
---

# Function: createWindowedCounter()

```ts
function createWindowedCounter(options?): IWindowedCounter;
```

Defined in: [libs/platform-caching/src/createWindowedCounter.ts:40](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/createWindowedCounter.ts#L40)

Creates the windowed counter that fits the configured infrastructure.

Choosing the implementation belongs to the platform, not to the feature that counts: a feature
deciding this itself would end up with its own idea of where limits live, and a deployment without
a shared store would silently get a different limit than the one configured.

The order is deliberate. A SQL client is preferred over a Redis URL because an application that
has a database always has one, while a cache may be absent — and two stores counting the same
subject would enforce two different limits. Without either, the counter stays in process memory,
which is correct for a single instance and must be reported by the caller for several.

## Parameters

| Parameter  | Type                                                                       | Description                                                                                |
| ---------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `options?` | [`ICreateWindowedCounterOptions`](Interface.ICreateWindowedCounterOptions) | Store configuration. Without a client and without a URL the in-memory counter is returned. |

## Returns

[`IWindowedCounter`](Interface.IWindowedCounter)
