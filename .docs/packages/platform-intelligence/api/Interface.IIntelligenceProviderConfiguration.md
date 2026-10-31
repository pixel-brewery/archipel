---
title: 'Interface: IIntelligenceProviderConfiguration'
generated: true
editUrl: false
---

# Interface: IIntelligenceProviderConfiguration

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L6)

Describes the resolved configuration for the intelligence provider.

## Properties

### apiKey

```ts
readonly apiKey: string | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L28)

The API key used to authenticate with the provider.

---

### baseUrl

```ts
readonly baseUrl: string | null;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L35)

An optional base URL override for the provider API.

---

### maxOutputTokens

```ts
readonly maxOutputTokens: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L56)

The maximum number of output tokens per completion.

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L21)

The model identifier to use for text generation.

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L14)

The resolved provider identifier.

---

### temperature

```ts
readonly temperature: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L42)

The sampling temperature used for text generation.

---

### topP

```ts
readonly topP: number;
```

Defined in: [libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IIntelligenceProviderConfiguration.ts#L49)

The top-p (nucleus) sampling parameter.
