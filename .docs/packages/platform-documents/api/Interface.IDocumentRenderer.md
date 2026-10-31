---
title: 'Interface: IDocumentRenderer'
generated: true
editUrl: false
---

# Interface: IDocumentRenderer

Defined in: [libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts#L10)

Base interface for document renderers.
Each renderer handles specific document formats.

## Properties

### supportedFormats

```ts
readonly supportedFormats: readonly DocumentFormat[];
```

Defined in: [libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts#L14)

Supported document formats for this renderer.

## Methods

### render()

```ts
render(options): Promise<IRenderResult>;
```

Defined in: [libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/interfaces/IDocumentRenderer.ts#L22)

Render a document from template with provided data.

#### Parameters

| Parameter | Type                                         | Description    |
| --------- | -------------------------------------------- | -------------- |
| `options` | [`IRenderOptions`](Interface.IRenderOptions) | Render options |

#### Returns

`Promise`\<[`IRenderResult`](Interface.IRenderResult)\>

Render result with buffer and metadata
