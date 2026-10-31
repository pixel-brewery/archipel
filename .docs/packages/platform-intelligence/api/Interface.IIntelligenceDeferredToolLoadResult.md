---
title: 'Interface: IIntelligenceDeferredToolLoadResult'
generated: true
editUrl: false
---

# Interface: IIntelligenceDeferredToolLoadResult

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts#L10)

Output of the built-in deferred tool loader.

The model receives this result as the loader's tool result, and
`onToolExecutionEnd` observers receive it as the loader's `tool-result`
output.

## Properties

### alreadyActive

```ts
readonly alreadyActive: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts#L17)

Requested tools that were already active, including the loader itself.

---

### loaded

```ts
readonly loaded: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts#L14)

Requested tools activated by this loader call. They are callable from the next step on.

---

### unknown

```ts
readonly unknown: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadResult.ts#L20)

Requested names that are not available for this call.
