---
title: 'Type Alias: IIntelligencePromptModelRequirement'
generated: true
editUrl: false
---

# Type Alias: IIntelligencePromptModelRequirement

```ts
type IIntelligencePromptModelRequirement =
    | {
          strategy: 'automatic';
      }
    | {
          models: ReadonlyArray<IIntelligenceModelReference>;
          strategy: 'preferred';
      }
    | {
          model: IIntelligenceModelReference;
          strategy: 'fixed';
      };
```

Defined in: [libs/platform-intelligence/src/prompts/IIntelligencePromptModelRequirement.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IIntelligencePromptModelRequirement.ts#L12)

Model selection requested by a reusable intelligence prompt.
