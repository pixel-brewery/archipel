---
title: 'Class: MailModule'
generated: true
editUrl: false
---

# Class: MailModule

Defined in: [libs/platform-mailing/src/MailModule.ts:87](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L87)

Represents the mail module.

Delivery and template strategies are selected at compile time via
`IMailModuleOptions`. NestJS DI resolves the concrete classes.

## Constructors

### Constructor

```ts
new MailModule(): MailModule;
```

#### Returns

`MailModule`

## Methods

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-mailing/src/MailModule.ts:98](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L98)

Registers the mail module with the specified configuration.

#### Parameters

| Parameter | Type                                                 | Description                  |
| --------- | ---------------------------------------------------- | ---------------------------- |
| `options` | [`IMailModuleOptions`](Interface.IMailModuleOptions) | Module registration options. |

#### Returns

`DynamicModule`

A configured `DynamicModule`.
