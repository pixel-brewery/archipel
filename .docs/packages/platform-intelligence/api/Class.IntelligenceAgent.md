---
title: 'Class: IntelligenceAgent'
generated: true
editUrl: false
---

# Class: IntelligenceAgent

Defined in: [libs/platform-intelligence/src/IntelligenceAgent.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgent.ts#L17)

Reusable provider-neutral agent backed by the language capability.

## Constructors

### Constructor

```ts
new IntelligenceAgent(configuration, languageGenerator): IntelligenceAgent;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgent.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgent.ts#L27)

#### Parameters

| Parameter           | Type                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| `configuration`     | [`IIntelligenceAgentConfiguration`](Interface.IIntelligenceAgentConfiguration) |
| `languageGenerator` | [`IntelligenceLanguageGenerator`](Class.IntelligenceLanguageGenerator)         |

#### Returns

`IntelligenceAgent`

## Accessors

### name

#### Get Signature

```ts
get name(): string | undefined;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgent.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgent.ts#L37)

Optional stable agent name used by application observability.

##### Returns

`string` \| `undefined`

## Methods

### generate()

```ts
generate(prompt, options?): Promise<IIntelligenceLanguageCompletion<string>>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgent.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgent.ts#L46)

Executes one bounded agent run.

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceLanguageCompletion`](Interface.IIntelligenceLanguageCompletion)\<`string`\>\>

---

### stream()

```ts
stream(prompt, options?): Promise<IIntelligenceLanguageStream>;
```

Defined in: [libs/platform-intelligence/src/IntelligenceAgent.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/IntelligenceAgent.ts#L51)

Streams one agent run.

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceLanguageStream`](Interface.IIntelligenceLanguageStream)\>
