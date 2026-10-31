---
title: 'Class: IntelligenceConfigurationError'
generated: true
editUrl: false
---

# Class: IntelligenceConfigurationError

Defined in: [libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts#L6)

Error thrown when an intelligence provider configuration is invalid or missing.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new IntelligenceConfigurationError(message): IntelligenceConfigurationError;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts#L15)

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `message` | `string` |

#### Returns

`IntelligenceConfigurationError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "INTELLIGENCE_CONFIGURATION" = 'INTELLIGENCE_CONFIGURATION';
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceConfigurationError.ts#L9)
