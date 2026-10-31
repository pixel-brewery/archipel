---
title: 'Class: MailTemplateEngine'
generated: true
editUrl: false
---

# Class: MailTemplateEngine

Defined in: [libs/platform-mailing/src/templating/MailTemplateEngine.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/MailTemplateEngine.ts#L18)

The `MailTemplateEngine` class.

## Implements

- `OnModuleInit`

## Constructors

### Constructor

```ts
new MailTemplateEngine(templateFetchStrategy, contentTemplateEngine): MailTemplateEngine;
```

Defined in: [libs/platform-mailing/src/templating/MailTemplateEngine.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/MailTemplateEngine.ts#L34)

Constructs a new instance of the `MailTemplateEngine` class.

#### Parameters

| Parameter               | Type                                                           |
| ----------------------- | -------------------------------------------------------------- |
| `templateFetchStrategy` | [`TemplateFetchStrategyBase`](Class.TemplateFetchStrategyBase) |
| `contentTemplateEngine` | `ContentTemplateEngine`                                        |

#### Returns

`MailTemplateEngine`

## Methods

### compileTemplate()

```ts
compileTemplate(
   templateKey,
   params,
   format
): string;
```

Defined in: [libs/platform-mailing/src/templating/MailTemplateEngine.ts:67](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/MailTemplateEngine.ts#L67)

Compiles a template by replacing placeholders with the provided parameters.

#### Parameters

| Parameter     | Type                                                 | Description                                   |
| ------------- | ---------------------------------------------------- | --------------------------------------------- |
| `templateKey` | `string`                                             | The key of the template to compile.           |
| `params`      | `Record`\<`string`, `unknown`\>                      | The parameters to insert into the template.   |
| `format`      | [`MailTemplateFormat`](TypeAlias.MailTemplateFormat) | The format of the template ('html' or 'txt'). |

#### Returns

`string`

The compiled template as a string.

#### Throws

Error if the template or format is not found.

---

### onModuleInit()

```ts
onModuleInit(): Promise<void>;
```

Defined in: [libs/platform-mailing/src/templating/MailTemplateEngine.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/MailTemplateEngine.ts#L53)

Lifecycle hook that runs after the module initialization.
Loads all templates from the disk and caches them in memory.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnModuleInit.onModuleInit`

---

### resolveSubject()

```ts
resolveSubject(templateKey, params): string | undefined;
```

Defined in: [libs/platform-mailing/src/templating/MailTemplateEngine.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/templating/MailTemplateEngine.ts#L97)

Resolves and interpolates the subject line from a stored template.

#### Parameters

| Parameter     | Type                            | Description                                |
| ------------- | ------------------------------- | ------------------------------------------ |
| `templateKey` | `string`                        | The key of the template.                   |
| `params`      | `Record`\<`string`, `unknown`\> | The parameters to insert into the subject. |

#### Returns

`string` \| `undefined`

The compiled subject string, or `undefined` if no subject is stored.
