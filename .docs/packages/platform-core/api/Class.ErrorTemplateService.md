---
title: 'Class: ErrorTemplateService'
generated: true
editUrl: false
---

# Class: ErrorTemplateService

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L81)

Service for rendering error page templates.

## Constructors

### Constructor

```ts
new ErrorTemplateService(
   configService,
   contentTemplateEngine,
   resourceManager
): ErrorTemplateService;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:97](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L97)

Constructs a new instance of the `ErrorTemplateService` class.

#### Parameters

| Parameter               | Type                                                   |
| ----------------------- | ------------------------------------------------------ |
| `configService`         | `ConfigService`                                        |
| `contentTemplateEngine` | [`ContentTemplateEngine`](Class.ContentTemplateEngine) |
| `resourceManager`       | `ResourceManager`                                      |

#### Returns

`ErrorTemplateService`

## Methods

### getErrorMessage()

```ts
getErrorMessage(statusCode): string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:176](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L176)

Gets a human-readable error message based on status code.

#### Parameters

| Parameter    | Type     | Description           |
| ------------ | -------- | --------------------- |
| `statusCode` | `number` | The HTTP status code. |

#### Returns

`string`

The error message.

---

### getErrorPageContent()

```ts
getErrorPageContent(params): Promise<string>;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L114)

Retrieves the error page HTML content.

#### Parameters

| Parameter | Type                                             | Description                |
| --------- | ------------------------------------------------ | -------------------------- |
| `params`  | [`IErrorPageParams`](Interface.IErrorPageParams) | The error page parameters. |

#### Returns

`Promise`\<`string`\>

The rendered HTML content.

---

### getErrorTitle()

```ts
getErrorTitle(statusCode): string;
```

Defined in: [libs/platform-core/src/services/ErrorTemplateService.ts:147](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/ErrorTemplateService.ts#L147)

Gets a human-readable error title based on status code.

#### Parameters

| Parameter    | Type     | Description           |
| ------------ | -------- | --------------------- |
| `statusCode` | `number` | The HTTP status code. |

#### Returns

`string`

The error title.
