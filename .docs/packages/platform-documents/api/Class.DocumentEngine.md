---
title: 'Class: DocumentEngine'
generated: true
editUrl: false
---

# Class: DocumentEngine

Defined in: [libs/platform-documents/src/engine/DocumentEngine.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/engine/DocumentEngine.ts#L20)

DocumentEngine orchestrates document generation workflow.
Coordinates resource loading and renderer components.

## Constructors

### Constructor

```ts
new DocumentEngine(
   resourceManager,
   renderers,
   options
): DocumentEngine;
```

Defined in: [libs/platform-documents/src/engine/DocumentEngine.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/engine/DocumentEngine.ts#L46)

#### Parameters

| Parameter         | Type                                                         |
| ----------------- | ------------------------------------------------------------ |
| `resourceManager` | `ResourceManager`                                            |
| `renderers`       | [`IDocumentRenderer`](Interface.IDocumentRenderer)[]         |
| `options`         | [`IDocumentModuleOptions`](Interface.IDocumentModuleOptions) |

#### Returns

`DocumentEngine`

## Accessors

### renderers

#### Get Signature

```ts
get renderers(): ReadonlyMap<string, IDocumentRenderer>;
```

Defined in: [libs/platform-documents/src/engine/DocumentEngine.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/engine/DocumentEngine.ts#L38)

Get available renderers.

##### Returns

`ReadonlyMap`\<`string`, [`IDocumentRenderer`](Interface.IDocumentRenderer)\>

Map of format to renderer

## Methods

### render()

```ts
render(options): Promise<IRenderResult & {
  name: string;
}>;
```

Defined in: [libs/platform-documents/src/engine/DocumentEngine.ts:77](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/engine/DocumentEngine.ts#L77)

Render a document from template.

#### Parameters

| Parameter | Type                                         | Description    |
| --------- | -------------------------------------------- | -------------- |
| `options` | [`IRenderOptions`](Interface.IRenderOptions) | Render options |

#### Returns

`Promise`\<[`IRenderResult`](Interface.IRenderResult) & \{
`name`: `string`;
\}\>

Render result with buffer and metadata
