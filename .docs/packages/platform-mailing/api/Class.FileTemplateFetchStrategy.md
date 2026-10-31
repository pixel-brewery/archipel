---
title: 'Class: FileTemplateFetchStrategy'
generated: true
editUrl: false
---

# Class: FileTemplateFetchStrategy

Defined in: [libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts#L20)

The `FileTemplateFetchStrategy` class.

Loads mail templates from the file system via `ResourceManager`.
Template names are injected via `MAIL_TEMPLATE_NAMES_TOKEN` — defaults to an empty array.

## Extends

- [`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase)

## Constructors

### Constructor

```ts
new FileTemplateFetchStrategy(resourceManager, templateNames): FileTemplateFetchStrategy;
```

Defined in: [libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts#L31)

#### Parameters

| Parameter         | Type                |
| ----------------- | ------------------- |
| `resourceManager` | `ResourceManager`   |
| `templateNames`   | readonly `string`[] |

#### Returns

`FileTemplateFetchStrategy`

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`constructor`](Class.TemplateFetchStrategyBase#constructor)

## Methods

### load()

```ts
load(): Promise<Record<string, IMailTemplateVariants>>;
```

Defined in: [libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/file/FileTemplateFetchStrategy.ts#L46)

Loads mail templates from the file system.

#### Returns

`Promise`\<`Record`\<`string`, [`IMailTemplateVariants`](Interface.IMailTemplateVariants)\>\>

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`load`](Class.TemplateFetchStrategyBase#load)
