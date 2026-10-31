---
title: 'Interface: IIntelligenceTool'
generated: true
editUrl: false
---

# Interface: IIntelligenceTool

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts#L13)

Minimal shape required by the intelligence tool registry.

## Properties

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts#L22)

Gets the unique registry name for the tool.

---

### tool

```ts
readonly tool:
  | IIntelligenceToolDefinition<unknown, unknown>
  | IIntelligenceProviderToolDefinition;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceTool.ts#L30)

Gets the provider-neutral or opaque provider-owned tool definition.
