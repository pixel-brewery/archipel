---
title: 'Class: IntelligenceProviderError'
generated: true
editUrl: false
---

# Class: IntelligenceProviderError

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L6)

Error thrown when an intelligence provider call fails.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new IntelligenceProviderError(
   message,
   provider,
   model,
   isRetryable,
   cause?
): IntelligenceProviderError;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L18)

#### Parameters

| Parameter     | Type      |
| ------------- | --------- |
| `message`     | `string`  |
| `provider`    | `string`  |
| `model`       | `string`  |
| `isRetryable` | `boolean` |
| `cause?`      | `Error`   |

#### Returns

`IntelligenceProviderError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "INTELLIGENCE_PROVIDER" = 'INTELLIGENCE_PROVIDER';
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L9)

---

### isRetryable

```ts
readonly isRetryable: boolean;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L12)

---

### model

```ts
readonly model: string;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L11)

---

### provider

```ts
readonly provider: string;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceProviderError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceProviderError.ts#L10)
