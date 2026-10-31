---
title: 'Class: DocumentModule'
generated: true
editUrl: false
---

# Class: DocumentModule

Defined in: [libs/platform-documents/src/DocumentModule.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L73)

DocumentModule provides services for document generation and image processing.
Uses abstract base classes and interfaces for extensibility.

## Constructors

### Constructor

```ts
new DocumentModule(): DocumentModule;
```

#### Returns

`DocumentModule`

## Methods

### forRoot()

```ts
static forRoot(options): DynamicModule;
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:83](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L83)

Configures the module with the specified options.

#### Parameters

| Parameter | Type                                                         | Description                       |
| --------- | ------------------------------------------------------------ | --------------------------------- |
| `options` | [`IDocumentModuleOptions`](Interface.IDocumentModuleOptions) | The module configuration options. |

#### Returns

`DynamicModule`

Dynamic module definition
