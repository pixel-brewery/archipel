---
title: 'Abstract Class: TemplateFetchStrategyBase'
generated: true
editUrl: false
---

# Abstract Class: TemplateFetchStrategyBase

Defined in: [libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts#L9)

Represents the base class for template fetch strategies.

## Extended by

- [`BlobTemplateFetchStrategy`](Class.BlobTemplateFetchStrategy)
- [`FileTemplateFetchStrategy`](Class.FileTemplateFetchStrategy)
- [`DatabaseTemplateFetchStrategy`](Class.DatabaseTemplateFetchStrategy)

## Constructors

### Constructor

```ts
protected new TemplateFetchStrategyBase(): TemplateFetchStrategyBase;
```

Defined in: [libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts#L20)

Initializes a new instance of the `TemplateFetchStrategyBase` class.

#### Returns

`TemplateFetchStrategyBase`

## Methods

### load()

```ts
abstract load(): Promise<Record<string, IMailTemplateVariants>>;
```

Defined in: [libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/abstracts/TemplateFetchStrategyBase.ts#L37)

Loads the templates.

#### Returns

`Promise`\<`Record`\<`string`, [`IMailTemplateVariants`](Interface.IMailTemplateVariants)\>\>
