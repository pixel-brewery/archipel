---
title: 'Class: SwaggerTheme'
generated: true
editUrl: false
---

# Class: SwaggerTheme

Defined in: [libs/platform-openapi/src/SwaggerTheme.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/SwaggerTheme.ts#L15)

The swagger theme class

## Constructors

### Constructor

```ts
new SwaggerTheme(resourceManager, config?): SwaggerTheme;
```

Defined in: [libs/platform-openapi/src/SwaggerTheme.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/SwaggerTheme.ts#L34)

Constructs a new instance of the `SwaggerTheme` class.

#### Parameters

| Parameter         | Type                                                   | Description                                      |
| ----------------- | ------------------------------------------------------ | ------------------------------------------------ |
| `resourceManager` | `ResourceManager`                                      | Resource manager for loading theme files         |
| `config?`         | [`ISwaggerThemeConfig`](Interface.ISwaggerThemeConfig) | Optional theme configuration for branding colors |

#### Returns

`SwaggerTheme`

## Methods

### getConfig()

```ts
getConfig(): ISwaggerThemeConfig;
```

Defined in: [libs/platform-openapi/src/SwaggerTheme.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/SwaggerTheme.ts#L49)

Returns the theme configuration

#### Returns

[`ISwaggerThemeConfig`](Interface.ISwaggerThemeConfig)

---

### getOptions()

```ts
getOptions(): Pick<SwaggerCustomOptions, "customCss" | "customJsStr">;
```

Defined in: [libs/platform-openapi/src/SwaggerTheme.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/SwaggerTheme.ts#L57)

#### Returns

`Pick`\<`SwaggerCustomOptions`, `"customCss"` \| `"customJsStr"`\>
