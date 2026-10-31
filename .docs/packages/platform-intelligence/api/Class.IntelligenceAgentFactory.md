---
title: 'Class: IntelligenceAgentFactory'
generated: true
editUrl: false
---

# Class: IntelligenceAgentFactory

Defined in: [libs/platform-intelligence/src/IntelligenceAgentFactory.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgentFactory.ts#L16)

Creates reusable provider-neutral tool-loop agents.

## Constructors

### Constructor

```ts
new IntelligenceAgentFactory(languageGenerator): IntelligenceAgentFactory;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgentFactory.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgentFactory.ts#L25)

#### Parameters

| Parameter           | Type                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| `languageGenerator` | [`IntelligenceLanguageGenerator`](Class.IntelligenceLanguageGenerator) |

#### Returns

`IntelligenceAgentFactory`

## Methods

### create()

```ts
create(configuration): IntelligenceAgent;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgentFactory.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgentFactory.ts#L38)

Creates a reusable agent that resolves its provider model only when run.

#### Parameters

| Parameter       | Type                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| `configuration` | [`IIntelligenceAgentConfiguration`](Interface.IIntelligenceAgentConfiguration) |

#### Returns

[`IntelligenceAgent`](Class.IntelligenceAgent)
