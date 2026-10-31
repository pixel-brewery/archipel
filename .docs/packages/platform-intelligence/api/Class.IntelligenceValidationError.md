---
title: 'Class: IntelligenceValidationError'
generated: true
editUrl: false
---

# Class: IntelligenceValidationError

Defined in: [libs/platform-intelligence/src/errors/IntelligenceValidationError.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationError.ts#L19)

Error thrown when an intelligence input validation fails.

## Remarks

[IntelligenceValidationError.stage](#stage) tells an invalid request apart
from an unusable provider answer: `input` for a request, prompt, option or
tool configuration the application built before any provider call, and
`output` for a provider answer that violates the output contract.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new IntelligenceValidationError(message, stage?): IntelligenceValidationError;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceValidationError.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationError.ts#L37)

Constructs a new instance of the `IntelligenceValidationError` class.

#### Parameters

| Parameter | Type                                                                   | Default value                        | Description                                                             |
| --------- | ---------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `message` | `string`                                                               | `undefined`                          | Diagnostic message.                                                     |
| `stage?`  | [`IntelligenceValidationStage`](TypeAlias.IntelligenceValidationStage) | `IntelligenceValidationStages.Input` | Which side of the provider call failed validation. Defaults to `input`. |

#### Returns

`IntelligenceValidationError`

#### Overrides

`Error.constructor`

## Properties

### code

```ts
readonly code: "INTELLIGENCE_VALIDATION" = 'INTELLIGENCE_VALIDATION';
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceValidationError.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationError.ts#L22)

---

### stage

```ts
readonly stage: IntelligenceValidationStage;
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceValidationError.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationError.ts#L25)

Which side of the provider call failed validation.
