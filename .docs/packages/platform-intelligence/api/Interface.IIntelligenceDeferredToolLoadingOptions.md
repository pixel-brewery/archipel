---
title: 'Interface: IIntelligenceDeferredToolLoadingOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceDeferredToolLoadingOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts#L15)

On-demand exposure of a large composed tool catalog during one language call.

The AI SDK receives every composed tool plus a built-in loader tool, but each
generation step exposes full tool contracts only for the active subset: the
loader, the [initialToolNames](#initialtoolnames), and every tool loaded earlier in the
same call. The loader's description names each tool that is not yet active
with a one-sentence summary, so the model knows the complete catalog and can
load the tools it needs mid-generation. A tool that is not active cannot be
executed in that step. Activation state belongs to one call and is never
shared with another call.

## Properties

### initialToolNames?

```ts
readonly initialToolNames?: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts#L25)

Composed tool names whose full contracts are exposed from the first step.

Defaults to none, so only the loader tool is exposed initially. Duplicate
names and names unavailable after registry/local composition are rejected
with `IntelligenceValidationError`.

---

### loaderToolName?

```ts
readonly loaderToolName?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts#L33)

Name of the built-in loader tool.

Defaults to `load_tools`. The name must not be empty, must not have
leading or trailing spaces, and must not collide with a composed tool.

---

### maxToolsPerLoad?

```ts
readonly maxToolsPerLoad?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceDeferredToolLoadingOptions.ts#L42)

Maximum number of tool names the model may request in one loader call.

Defaults to `10` and must be a safe integer between `1` and `50`. A loader
call requesting more names is rejected as invalid tool input and
activates nothing.
