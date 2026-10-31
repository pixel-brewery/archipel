---
title: 'Interface: IIntelligenceModuleOptions'
generated: true
editUrl: false
---

# Interface: IIntelligenceModuleOptions

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L19)

Options for configuring the intelligence module.

## Properties

### configEntries?

```ts
readonly configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L46)

Provider-specific configuration entries to register with the config module.

---

### defaultModels?

```ts
readonly defaultModels?: Readonly<Partial<Record<IntelligenceCapability, IIntelligenceModelReference>>>;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L56)

Capability-specific default provider and model references.

---

### isGlobal?

```ts
readonly isGlobal?: boolean;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:91](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L91)

When `true` the module is registered globally.

---

### maxTools?

```ts
readonly maxTools?: number;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L39)

Maximum number of application tools retained by the shared registry.

This limits registered definitions, independently from the smaller
per-request exposure selected through `activeToolNames` or
`deferredToolLoading`.

#### Default Value

```ts
128
@public
```

---

### promptPolicyAdapter?

```ts
readonly promptPolicyAdapter?: Type<IntelligencePromptPolicyBase>;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:84](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L84)

Optional application policy adapter for provider-neutral prompt requirements.

---

### providerAdapters?

```ts
readonly providerAdapters?: readonly Type<IntelligenceProviderAdapterBase>[];
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L53)

Injectable provider adapter classes imported from tree-shakable provider subpaths.

---

### providerRequestTimeoutMs?

```ts
readonly providerRequestTimeoutMs?: number;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L70)

Maximum duration of one outbound provider request.

Long-running operations such as video generation use multiple bounded
provider requests under their capability-specific total timeout.

#### Default Value

```ts
5000
@public
```

---

### realtime?

```ts
readonly realtime?: IIntelligenceRealtimeModuleOptions;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L77)

Server-owned realtime model sessions, resilience limits, and metering.

---

### requestTimeouts?

```ts
readonly requestTimeouts?: Readonly<Partial<Record<IntelligenceCapability, number>>>;
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L59)

Capability-specific total request timeout overrides.

---

### tools?

```ts
readonly tools?: readonly (
  | IIntelligenceTool
  | Promise<IIntelligenceTool>
  | Type<IIntelligenceTool>
  | Provider<IIntelligenceTool>)[];
```

Defined in: [libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/interfaces/IIntelligenceModuleOptions.ts#L27)

Tool instances, tool factory promises, class providers, or custom Nest providers registered at bootstrap.
