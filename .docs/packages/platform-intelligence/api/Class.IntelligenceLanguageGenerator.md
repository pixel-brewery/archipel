---
title: 'Class: IntelligenceLanguageGenerator'
generated: true
editUrl: false
---

# Class: IntelligenceLanguageGenerator

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:111](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L111)

Provider-neutral language generation, structured output, and streaming facade.

## Constructors

### Constructor

```ts
new IntelligenceLanguageGenerator(modelResolver, toolRegistry): IntelligenceLanguageGenerator;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:122](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L122)

#### Parameters

| Parameter       | Type                                                         |
| --------------- | ------------------------------------------------------------ |
| `modelResolver` | `IntelligenceModelResolver`                                  |
| `toolRegistry`  | [`IntelligenceToolRegistry`](Class.IntelligenceToolRegistry) |

#### Returns

`IntelligenceLanguageGenerator`

## Methods

### generateObject()

```ts
generateObject<T>(
   prompt,
   schema,
   options?
): Promise<IIntelligenceLanguageCompletion<T>>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:182](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L182)

Generates a schema-constrained object through the language capability.

#### Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `schema`   | [`IIntelligenceSchema`](TypeAlias.IIntelligenceSchema)\<`T`\>                                |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceLanguageCompletion`](Interface.IIntelligenceLanguageCompletion)\<`T`\>\>

---

### generateText()

```ts
generateText(prompt, options?): Promise<IIntelligenceLanguageCompletion<string>>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:140](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L140)

Generates plain text and normalized tool metadata.

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceLanguageCompletion`](Interface.IIntelligenceLanguageCompletion)\<`string`\>\>

---

### getDefaultModel()

```ts
getDefaultModel(): IIntelligenceModelStatus;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:339](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L339)

Returns the default language model without exposing credentials.

#### Returns

[`IIntelligenceModelStatus`](Interface.IIntelligenceModelStatus)

---

### prepareText()

```ts
prepareText(prompt, options?): Promise<IIntelligencePreparedLanguageCall<string>>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:156](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L156)

Resolves and validates a single-use text call without contacting the provider.

The returned capacity snapshot is captured from the exact standardized
initial provider input through a local synthetic response. The optional
provider guard still runs later on every real provider attempt.

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligencePreparedLanguageCall`](Interface.IIntelligencePreparedLanguageCall)\<`string`\>\>

---

### streamObject()

```ts
streamObject<T>(
   prompt,
   schema,
   options?
): Promise<IIntelligenceObjectStream<T>>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:266](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L266)

Streams partial structured output through the language capability.

#### Type Parameters

| Type Parameter                      |
| ----------------------------------- |
| <a id="type-parameter-t-1"></a> `T` |

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `schema`   | [`IIntelligenceSchema`](TypeAlias.IIntelligenceSchema)\<`T`\>                                |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceObjectStream`](Interface.IIntelligenceObjectStream)\<`T`\>\>

---

### streamText()

```ts
streamText(prompt, options?): Promise<IIntelligenceLanguageStream>;
```

Defined in: [libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts:200](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/generators/IntelligenceLanguageGenerator.ts#L200)

Streams text without exposing the native AI SDK stream object.

#### Parameters

| Parameter  | Type                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------- |
| `prompt`   | [`IIntelligencePrompt`](Interface.IIntelligencePrompt)                                       |
| `options?` | [`IIntelligenceLanguageGenerationOptions`](Interface.IIntelligenceLanguageGenerationOptions) |

#### Returns

`Promise`\<[`IIntelligenceLanguageStream`](Interface.IIntelligenceLanguageStream)\>
