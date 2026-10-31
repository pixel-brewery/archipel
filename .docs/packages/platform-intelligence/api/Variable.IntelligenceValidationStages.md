---
title: 'Variable: IntelligenceValidationStages'
generated: true
editUrl: false
---

# Variable: IntelligenceValidationStages

```ts
const IntelligenceValidationStages: {
    Input: 'input';
    Output: 'output';
};
```

Defined in: [libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts#L6)

Identifies which side of a provider call failed validation.

## Type Declaration

| Name                                  | Type       | Default value | Description                                                                              | Defined in                                                                                                                                                                                                |
| ------------------------------------- | ---------- | ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <a id="property-input"></a> `Input`   | `"input"`  | `'input'`     | The request, prompt, options or tool configuration was invalid before any provider call. | [libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts#L8)   |
| <a id="property-output"></a> `Output` | `"output"` | `'output'`    | The provider answered, but its answer violated the output contract.                      | [libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/errors/IntelligenceValidationStages.ts#L10) |
