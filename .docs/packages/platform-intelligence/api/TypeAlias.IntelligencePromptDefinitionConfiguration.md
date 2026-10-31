---
title: 'Type Alias: IntelligencePromptDefinitionConfiguration\<TInput, TOutput\>'
generated: true
editUrl: false
---

# Type Alias: IntelligencePromptDefinitionConfiguration\<TInput, TOutput\>

```ts
type IntelligencePromptDefinitionConfiguration<TInput, TOutput> =
    | (IIntelligencePromptDefinitionConfigurationBase<TInput> & {
          mode: 'text';
          outputSchema?: never;
      })
    | (IIntelligencePromptDefinitionConfigurationBase<TInput> & {
          mode: 'object';
          outputSchema: IIntelligenceSchema<TOutput>;
      });
```

Defined in: [libs/platform-intelligence/src/prompts/IntelligencePromptDefinitionConfiguration.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/prompts/IntelligencePromptDefinitionConfiguration.ts#L24)

Configuration accepted by [intelligencePrompt](Function.intelligencePrompt).

## Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |
