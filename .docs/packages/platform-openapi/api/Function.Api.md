---
title: 'Function: Api()'
generated: true
editUrl: false
---

# Function: Api()

```ts
function Api(options): ClassDecorator & MethodDecorator & PropertyDecorator;
```

Defined in: [libs/platform-openapi/src/decorators/Api.ts:142](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-openapi/src/decorators/Api.ts#L142)

Composite Swagger decorator that wraps all NestJS OpenAPI decorators into a single declaration.

## Parameters

| Parameter | Type          | Description                               |
| --------- | ------------- | ----------------------------------------- |
| `options` | `IApiOptions` | Configuration for the Swagger decorators. |

## Returns

`ClassDecorator` & `MethodDecorator` & `PropertyDecorator`
