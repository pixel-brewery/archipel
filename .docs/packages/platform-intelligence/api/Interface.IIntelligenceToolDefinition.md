---
title: 'Interface: IIntelligenceToolDefinition\<TInput, TOutput\>'
generated: true
editUrl: false
---

# Interface: IIntelligenceToolDefinition\<TInput, TOutput\>

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L14)

Provider-neutral application tool definition.

## Type Parameters

| Type Parameter                                | Default type |
| --------------------------------------------- | ------------ |
| <a id="type-parameter-tinput"></a> `TInput`   | `unknown`    |
| <a id="type-parameter-toutput"></a> `TOutput` | `unknown`    |

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L17)

---

### inputSchema

```ts
readonly inputSchema: IIntelligenceSchema<TInput>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L18)

---

### needsApproval?

```ts
readonly needsApproval?: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L21)

---

### outputSchema?

```ts
readonly outputSchema?: IIntelligenceSchema<TOutput>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L19)

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L20)

## Methods

### execute()?

```ts
execute ? (input, context) : TOutput | Promise<TOutput>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceToolDefinition.ts#L27)

#### Parameters

| Parameter              | Type                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`                | `TInput`                                                                                                                                                |
| `context`              | \{ `abortSignal?`: `AbortSignal`; `messages`: readonly [`IIntelligenceModelMessage`](TypeAlias.IIntelligenceModelMessage)[]; `toolCallId`: `string`; \} |
| `context.abortSignal?` | `AbortSignal`                                                                                                                                           |
| `context.messages`     | readonly [`IIntelligenceModelMessage`](TypeAlias.IIntelligenceModelMessage)[]                                                                           |
| `context.toolCallId`   | `string`                                                                                                                                                |

#### Returns

`TOutput` \| `Promise`\<`TOutput`\>
