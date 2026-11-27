---
title: 'Abstract Class: DocumentRendererBase'
generated: true
editUrl: false
---

# Abstract Class: DocumentRendererBase

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L18)

Base class for document renderers.
Provides common functionality for template loading, parsing, and image processing.

## Extended by

- [`DocxDocumentRenderer2`](Class.DocxDocumentRenderer2)
- [`PdfDocumentRenderer`](Class.PdfDocumentRenderer)

## Implements

- [`IDocumentRenderer`](Interface.IDocumentRenderer)

## Constructors

### Constructor

```ts
new DocumentRendererBase(
   options,
   resourceManager,
   imageProcessor
): DocumentRendererBase;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L31)

#### Parameters

| Parameter                  | Type                                                                                                                                                                                     | Description                                                                                                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                  | \{ `debug`: `boolean`; `delimiters`: \{ `end`: `string`; `start`: `string`; \}; `imageProcessor`: \{ \}; `maxImageHeight`: `number`; `maxImageWidth`: `number`; `renderers`: \{ \}[]; \} | -                                                                                                                                                                                                                              |
| `options.debug`            | `boolean`                                                                                                                                                                                | Enable debug logging for document processing pipeline. When enabled, detailed logs will be written for: - Parser strategy selection - Template variable replacements - Data object transformations - Renderer processing steps |
| `options.delimiters`       | \{ `end`: `string`; `start`: `string`; \}                                                                                                                                                | Delimiters for template placeholders.                                                                                                                                                                                          |
| `options.delimiters.end`   | `string`                                                                                                                                                                                 | Ending delimiter. **Default** `']]'`                                                                                                                                                                                           |
| `options.delimiters.start` | `string`                                                                                                                                                                                 | Starting delimiter. **Default** `'[['`                                                                                                                                                                                         |
| `options.imageProcessor`   | \{ \}                                                                                                                                                                                    | Image processor implementation class. Import from `@pixel-brewery/archipel-platform-documents/sharp` for the default Sharp-based processor.                                                                                    |
| `options.maxImageHeight`   | `number`                                                                                                                                                                                 | Maximum image height in pixels.                                                                                                                                                                                                |
| `options.maxImageWidth`    | `number`                                                                                                                                                                                 | Maximum image width in pixels.                                                                                                                                                                                                 |
| `options.renderers`        | \{ \}[]                                                                                                                                                                                  | Document renderer implementation classes. Import from `@pixel-brewery/archipel-platform-documents/docx` and `/pdf` for the built-in renderers.                                                                                 |
| `resourceManager`          | `ResourceManager`                                                                                                                                                                        | -                                                                                                                                                                                                                              |
| `imageProcessor`           | [`IImageProcessor`](Interface.IImageProcessor)                                                                                                                                           | -                                                                                                                                                                                                                              |

#### Returns

`DocumentRendererBase`

## Properties

### \_imageProcessor

```ts
protected readonly _imageProcessor: IImageProcessor;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L25)

---

### \_options

```ts
protected readonly _options: {
  debug: boolean;
  delimiters: {
     end: string;
     start: string;
  };
  imageProcessor: {
  };
  maxImageHeight: number;
  maxImageWidth: number;
  renderers: {
  }[];
};
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L21)

#### debug

```ts
readonly debug: boolean;
```

Enable debug logging for document processing pipeline.
When enabled, detailed logs will be written for:

- Parser strategy selection
- Template variable replacements
- Data object transformations
- Renderer processing steps

#### delimiters

```ts
readonly delimiters: {
  end: string;
  start: string;
};
```

Delimiters for template placeholders.

##### delimiters.end

```ts
readonly end: string;
```

Ending delimiter.

###### Default

```ts
']]';
```

##### delimiters.start

```ts
readonly start: string;
```

Starting delimiter.

###### Default

```ts
'[[';
```

#### imageProcessor

```ts
readonly imageProcessor: {
};
```

Image processor implementation class.
Import from `@pixel-brewery/archipel-platform-documents/sharp` for the default Sharp-based processor.

#### maxImageHeight

```ts
readonly maxImageHeight: number;
```

Maximum image height in pixels.

#### maxImageWidth

```ts
readonly maxImageWidth: number;
```

Maximum image width in pixels.

#### renderers

```ts
readonly renderers: {
}[];
```

Document renderer implementation classes.
Import from `@pixel-brewery/archipel-platform-documents/docx` and `/pdf` for the built-in renderers.

---

### \_resourceManager

```ts
protected readonly _resourceManager: ResourceManager;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L23)

## Accessors

### supportedFormats

#### Get Signature

```ts
get abstract supportedFormats(): readonly DocumentFormat[];
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L48)

Supported document formats for this renderer.

##### Returns

readonly [`DocumentFormat`](TypeAlias.DocumentFormat)[]

Supported document formats for this renderer.

#### Implementation of

[`IDocumentRenderer`](Interface.IDocumentRenderer).[`supportedFormats`](Interface.IDocumentRenderer#supportedformats)

## Methods

### isImagePayload()

```ts
protected isImagePayload(value): boolean;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:106](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L106)

Check if value is an image payload.

#### Parameters

| Parameter | Type      | Description    |
| --------- | --------- | -------------- |
| `value`   | `unknown` | Value to check |

#### Returns

`boolean`

True if image payload

---

### preprocessData()

```ts
protected preprocessData(data): Promise<Record<string, unknown>>;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:70](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L70)

Preprocess template data (process images).
Template syntax processing is handled later by parser.processXml().

#### Parameters

| Parameter | Type                            | Description       |
| --------- | ------------------------------- | ----------------- |
| `data`    | `Record`\<`string`, `unknown`\> | Raw template data |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

Processed data

---

### processImages()

```ts
protected processImages(data): Promise<Record<string, unknown>>;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:81](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L81)

Process image payloads in data.

#### Parameters

| Parameter | Type                            | Description |
| --------- | ------------------------------- | ----------- |
| `data`    | `Record`\<`string`, `unknown`\> | Data object |

#### Returns

`Promise`\<`Record`\<`string`, `unknown`\>\>

Data with processed images

---

### render()

```ts
abstract render(options): Promise<IRenderResult>;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L60)

Render a document from template with provided data.

#### Parameters

| Parameter | Type                                         | Description    |
| --------- | -------------------------------------------- | -------------- |
| `options` | [`IRenderOptions`](Interface.IRenderOptions) | Render options |

#### Returns

`Promise`\<[`IRenderResult`](Interface.IRenderResult)\>

Render result with buffer and metadata

#### Implementation of

[`IDocumentRenderer`](Interface.IDocumentRenderer).[`render`](Interface.IDocumentRenderer#render)
