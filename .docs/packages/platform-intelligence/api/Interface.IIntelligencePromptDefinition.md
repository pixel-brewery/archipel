---
title: 'Interface: IIntelligencePromptDefinition\<TInput, TOutput, TMode\>'
generated: true
editUrl: false
---

# Interface: IIntelligencePromptDefinition\<TInput, TOutput, TMode\>

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L17)

Reusable, immutable definition of an intelligence prompt.

## Type Parameters

| Type Parameter                                                                                                   | Default type                                                 |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| <a id="type-parameter-tinput"></a> `TInput`                                                                      | -                                                            |
| <a id="type-parameter-toutput"></a> `TOutput`                                                                    | -                                                            |
| <a id="type-parameter-tmode"></a> `TMode` _extends_ [`IntelligencePromptMode`](TypeAlias.IntelligencePromptMode) | [`IntelligencePromptMode`](TypeAlias.IntelligencePromptMode) |

## Properties

### execution?

```ts
readonly execution?: IIntelligencePromptExecutionPolicy;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L25)

---

### inputSchema

```ts
readonly inputSchema: IIntelligenceSchema<TInput>;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L23)

---

### mode

```ts
readonly mode: TMode;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L22)

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L20)

---

### outputSchema?

```ts
readonly outputSchema?: IIntelligenceSchema<TOutput>;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L24)

---

### version

```ts
readonly version: number;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L21)

## Methods

### messages()

```ts
messages(context): readonly IIntelligenceModelMessage[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L32)

#### Parameters

| Parameter | Type                                                                                         |
| --------- | -------------------------------------------------------------------------------------------- |
| `context` | [`IIntelligencePromptRenderContext`](Interface.IIntelligencePromptRenderContext)\<`TInput`\> |

#### Returns

readonly [`IIntelligenceModelMessage`](TypeAlias.IIntelligenceModelMessage)[]

---

### system()

```ts
system(context): string | readonly string[];
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L31)

#### Parameters

| Parameter | Type                                                                                         |
| --------- | -------------------------------------------------------------------------------------------- |
| `context` | [`IIntelligencePromptRenderContext`](Interface.IIntelligencePromptRenderContext)\<`TInput`\> |

#### Returns

`string` \| readonly `string`[]

---

### with()

```ts
with<TMetadata>(input, metadata?): IIntelligencePromptInvocation<TInput, TOutput, TMode, TMetadata>;
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptDefinition.ts#L33)

#### Type Parameters

| Type Parameter                                    | Default type |
| ------------------------------------------------- | ------------ |
| <a id="type-parameter-tmetadata"></a> `TMetadata` | `undefined`  |

#### Parameters

| Parameter   | Type        |
| ----------- | ----------- |
| `input`     | `TInput`    |
| `metadata?` | `TMetadata` |

#### Returns

[`IIntelligencePromptInvocation`](Interface.IIntelligencePromptInvocation)\<`TInput`, `TOutput`, `TMode`, `TMetadata`\>
