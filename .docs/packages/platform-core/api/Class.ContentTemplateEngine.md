---
title: 'Class: ContentTemplateEngine'
generated: true
editUrl: false
---

# Class: ContentTemplateEngine

Defined in: [libs/platform-core/src/templates/ContentTemplateEngine.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/templates/ContentTemplateEngine.ts#L17)

The `ContentTemplateEngine` class.

## Constructors

### Constructor

```ts
new ContentTemplateEngine(): ContentTemplateEngine;
```

Defined in: [libs/platform-core/src/templates/ContentTemplateEngine.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/templates/ContentTemplateEngine.ts#L25)

Constructs a new instance of the `ContentTemplateEngine` class.

#### Returns

`ContentTemplateEngine`

## Methods

### compileTemplate()

```ts
compileTemplate(content, params): string;
```

Defined in: [libs/platform-core/src/templates/ContentTemplateEngine.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/templates/ContentTemplateEngine.ts#L44)

Compiles a template by replacing placeholders with the provided parameters.

#### Parameters

| Parameter | Type                            | Description                                 |
| --------- | ------------------------------- | ------------------------------------------- |
| `content` | `string`                        | The content of the template to compile.     |
| `params`  | `Record`\<`string`, `unknown`\> | The parameters to insert into the template. |

#### Returns

`string`

The compiled template as a string.

#### Throws

GeneralTemplateValidationError if the template validation fails.

#### Throws

UnmatchedBlockError if template blocks are unmatched.

#### Throws

MissingPlaceholderError if placeholders are missing.
