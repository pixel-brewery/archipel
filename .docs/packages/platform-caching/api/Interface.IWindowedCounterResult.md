---
title: 'Interface: IWindowedCounterResult'
generated: true
editUrl: false
---

# Interface: IWindowedCounterResult

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L6)

Result of a windowed counter operation.

## Properties

### resetAt

```ts
readonly resetAt: Date;
```

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L19)

Moment the current window ends and the count starts over.

---

### value

```ts
readonly value: number;
```

Defined in: [libs/platform-caching/src/interfaces/IWindowedCounter.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-caching/src/interfaces/IWindowedCounter.ts#L12)

Count accumulated in the current window, including the increment that produced this result.
