---
title: 'Class: PlatformApplication'
generated: true
editUrl: false
---

# Class: PlatformApplication

Defined in: [libs/platform-bootstrap/src/application/PlatformApplication.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplication.ts#L10)

Entry point for composing an existing NestJS application with Archipel bootstrap steps.

## Methods

### from()

```ts
static from<TApplication>(app, options?): PlatformApplicationBuilder<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/application/PlatformApplication.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/application/PlatformApplication.ts#L33)

Wraps an already-created NestJS application in a fluent bootstrap builder.

#### Type Parameters

| Type Parameter                                                                                |
| --------------------------------------------------------------------------------------------- |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication`\<`any`\> |

#### Parameters

| Parameter  | Type                                                                   | Description                                     |
| ---------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| `app`      | `TApplication`                                                         | The NestJS application created by the consumer. |
| `options?` | [`IPlatformApplicationOptions`](Interface.IPlatformApplicationOptions) | Optional platform-level bootstrap dependencies. |

#### Returns

[`PlatformApplicationBuilder`](Class.PlatformApplicationBuilder)\<`TApplication`\>

A platform application builder.
