---
title: 'Class: DatabaseTemplateFetchStrategy'
generated: true
editUrl: false
---

# Class: DatabaseTemplateFetchStrategy

Defined in: [libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts#L22)

Template fetch strategy that loads templates from a database via the
[IMailTemplateRepository](Interface.IMailTemplateRepository) abstract base.

Applications provide the concrete repository implementation at module
registration time. This strategy loads all templates on module init
and caches them in-memory.

## Extends

- [`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase)

## Constructors

### Constructor

```ts
new DatabaseTemplateFetchStrategy(repository): DatabaseTemplateFetchStrategy;
```

Defined in: [libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts#L32)

#### Parameters

| Parameter    | Type                                                           |
| ------------ | -------------------------------------------------------------- |
| `repository` | [`IMailTemplateRepository`](Interface.IMailTemplateRepository) |

#### Returns

`DatabaseTemplateFetchStrategy`

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`constructor`](Class.TemplateFetchStrategyBase#constructor)

## Methods

### load()

```ts
load(): Promise<Record<string, IMailTemplateVariants>>;
```

Defined in: [libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/strategies/database/DatabaseTemplateFetchStrategy.ts#L48)

Loads all templates from the database and returns them grouped by key.
Only the default locale (no locale or first match) is loaded into the
in-memory cache used by `MailTemplateEngine`.

#### Returns

`Promise`\<`Record`\<`string`, [`IMailTemplateVariants`](Interface.IMailTemplateVariants)\>\>

#### Overrides

[`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase).[`load`](Class.TemplateFetchStrategyBase#load)
