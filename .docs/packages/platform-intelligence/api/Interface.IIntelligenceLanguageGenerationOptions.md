---
title: 'Interface: IIntelligenceLanguageGenerationOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceLanguageGenerationOptions

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L20)

Provider-neutral language generation controls.

## Extends

- [`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions)

## Properties

### abortSignal?

```ts
readonly abortSignal?: AbortSignal;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L16)

Caller-driven cancellation signal.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`abortSignal`](Interface.IIntelligenceRequestOptions#abortsignal)

---

### activeToolNames?

```ts
readonly activeToolNames?: readonly string[];
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L53)

Names of the composed tools that are available to this call.

When present, the AI SDK receives exactly this subset. Duplicate names
and names unavailable after registry/local composition are rejected with
`IntelligenceValidationError`. Cannot be combined with
[deferredToolLoading](#deferredtoolloading).

---

### beforeProviderCall?

```ts
readonly beforeProviderCall?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:76](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L76)

Authoritative guard invoked after native prompt/tool preparation and
immediately before every provider attempt.

A rejected promise or thrown error prevents that provider attempt. This
hook is suitable for durable fencing; `onStepStart` is telemetry only.

#### Parameters

| Parameter | Type                                                                                   |
| --------- | -------------------------------------------------------------------------------------- |
| `event`   | [`IIntelligenceProviderCallStartEvent`](Interface.IIntelligenceProviderCallStartEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### deferredToolLoading?

```ts
readonly deferredToolLoading?: IIntelligenceDeferredToolLoadingOptions;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L67)

Exposes the composed tool catalog on demand instead of sending every full
tool contract with each provider request.

The AI SDK receives all composed tools plus a built-in loader tool, while
each step exposes only the loader, the initial tools, and the tools
loaded earlier in the same call. Cannot be combined with
[activeToolNames](#activetoolnames) and requires [maxSteps](#maxsteps) of at least `2`, so
a loaded tool can be called in a later step. A specific
[toolChoice](#toolchoice) must name an initial tool or the loader. Invalid
settings are rejected with `IntelligenceValidationError` before the
provider is called.

---

### headers?

```ts
readonly headers?: Readonly<Record<string, string>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceRequestOptions.ts#L19)

Additional outbound request headers.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`headers`](Interface.IIntelligenceRequestOptions#headers)

---

### includeRegisteredTools?

```ts
readonly includeRegisteredTools?: boolean;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L44)

Includes tools from the application-wide registry in this call.

Defaults to `true`. Set to `false` for calls that may use only the tools
supplied through [tools](#tools).

---

### maxOutputTokens?

```ts
readonly maxOutputTokens?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L25)

---

### maxRetries?

```ts
readonly maxRetries?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L26)

---

### maxSteps?

```ts
readonly maxSteps?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L68)

---

### model?

```ts
readonly model?: IIntelligenceModelReference;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L24)

Optional provider/model override.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`model`](Interface.IIntelligenceRequestOptions#model)

---

### onStepStart?

```ts
readonly onStepStart?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L77)

#### Parameters

| Parameter | Type                                                                                       |
| --------- | ------------------------------------------------------------------------------------------ |
| `event`   | [`IIntelligenceGenerationStepStartEvent`](Interface.IIntelligenceGenerationStepStartEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### onToolExecutionEnd?

```ts
readonly onToolExecutionEnd?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L79)

#### Parameters

| Parameter | Type                                                                                 |
| --------- | ------------------------------------------------------------------------------------ |
| `event`   | [`IIntelligenceToolExecutionEndEvent`](Interface.IIntelligenceToolExecutionEndEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### onToolExecutionStart?

```ts
readonly onToolExecutionStart?: (event) => void | Promise<void>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:78](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L78)

#### Parameters

| Parameter | Type                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| `event`   | [`IIntelligenceToolExecutionStartEvent`](Interface.IIntelligenceToolExecutionStartEvent) |

#### Returns

`void` \| `Promise`\<`void`\>

---

### providerOptions?

```ts
readonly providerOptions?: Readonly<Record<string, Readonly<Record<string, IntelligenceJsonValue>>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L33)

Optional provider-specific settings.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`providerOptions`](Interface.IIntelligenceRequestOptions#provideroptions)

---

### providerTools?

```ts
readonly providerTools?: Readonly<Record<string, IIntelligenceProviderToolDefinition>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L36)

Provider-owned tools available to this call only, keyed by tool name.

Use the `tool` of a registration from a provider `/tools` subpath, for example
`createOpenAIWebSearchTool()`. The provider executes these tools itself; they never run application code.
Names must not repeat a name supplied through [tools](#tools); such a call is rejected with
`IntelligenceValidationError`. They take part in [activeToolNames](#activetoolnames) like every other composed tool.

---

### requestId?

```ts
readonly requestId?: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L27)

Correlation identifier included in structured Archipel logs.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`requestId`](Interface.IIntelligenceRequestOptions#requestid)

---

### temperature?

```ts
readonly temperature?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L23)

---

### timeoutMs?

```ts
readonly timeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts:30](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceModelRequestOptions.ts#L30)

Total provider-operation timeout in milliseconds.

#### Inherited from

[`IIntelligenceRequestOptions`](Interface.IIntelligenceRequestOptions).[`timeoutMs`](Interface.IIntelligenceRequestOptions#timeoutms)

---

### toolChoice?

```ts
readonly toolChoice?: IntelligenceToolChoice;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L37)

---

### tools?

```ts
readonly tools?: Readonly<Record<string, IIntelligenceToolDefinition<unknown, unknown>>>;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L27)

---

### topP?

```ts
readonly topP?: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceLanguageGenerationOptions.ts#L24)
