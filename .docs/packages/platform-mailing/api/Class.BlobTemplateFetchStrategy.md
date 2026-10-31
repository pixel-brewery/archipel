---
title: 'Class: BlobTemplateFetchStrategy'
generated: true
editUrl: false
---

# Class: BlobTemplateFetchStrategy

Defined in: [libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts#L17)

The `BlobTemplateFetchStrategy` class.

## Extends

- [`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase)

## Constructors

### Constructor

```ts
new BlobTemplateFetchStrategy(blobService): BlobTemplateFetchStrategy;
```

Defined in: [libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts#L32)

Constructs a new instance of the `BlobTemplateFetchStrategy` class.

#### Parameters

| Parameter     | Type          |
| ------------- | ------------- |
| `blobService` | `BlobService` |

#### Returns

`BlobTemplateFetchStrategy`

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`constructor`](Class.TemplateFetchStrategyBase#constructor)

## Methods

### load()

```ts
abstract load(): Promise<Record<string, IMailTemplateVariants>>;
```

Defined in: [libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/blob/BlobTemplateFetchStrategy.ts#L42)

Loads the templates.

#### Returns

`Promise`\<`Record`\<`string`, [`IMailTemplateVariants`](Interface.IMailTemplateVariants)\>\>

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`load`](Class.TemplateFetchStrategyBase#load)
