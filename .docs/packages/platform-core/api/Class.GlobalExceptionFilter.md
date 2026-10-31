---
title: 'Class: GlobalExceptionFilter'
generated: true
editUrl: false
---

# Class: GlobalExceptionFilter

Defined in: [libs/platform-core/src/filters/GlobalExceptionFilter.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/GlobalExceptionFilter.ts#L17)

A global exception filter that handles all uncaught exceptions in the application.
Returns HTML error pages for browser requests and JSON for API requests.

## Implements

- `ExceptionFilter`

## Constructors

### Constructor

```ts
new GlobalExceptionFilter(errorTemplateService?): GlobalExceptionFilter;
```

Defined in: [libs/platform-core/src/filters/GlobalExceptionFilter.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/GlobalExceptionFilter.ts#L32)

Constructs a new instance of the `GlobalExceptionFilter` class.

#### Parameters

| Parameter               | Type                                                 | Description                                         |
| ----------------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `errorTemplateService?` | [`ErrorTemplateService`](Class.ErrorTemplateService) | Optional error template service for HTML rendering. |

#### Returns

`GlobalExceptionFilter`

## Methods

### catch()

```ts
catch(exception, host): Promise<void>;
```

Defined in: [libs/platform-core/src/filters/GlobalExceptionFilter.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/filters/GlobalExceptionFilter.ts#L47)

Catches the exception and formats the response.

#### Parameters

| Parameter   | Type            | Description           |
| ----------- | --------------- | --------------------- |
| `exception` | `unknown`       | The caught exception. |
| `host`      | `ArgumentsHost` | The arguments host.   |

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ExceptionFilter.catch`
