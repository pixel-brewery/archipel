---
title: 'Class: DocxDocumentRenderer2'
generated: true
editUrl: false
---

# Class: DocxDocumentRenderer2

Defined in: [libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts#L17)

DOCX document renderer.
Delegates template processing to the configured parser (Encodian, Mustache, etc.).
The parser handles all template syntax logic via its processXml() method.

## Extends

- [`DocumentRendererBase`](Class.DocumentRendererBase)

## Constructors

### Constructor

```ts
new DocxDocumentRenderer2(
   options,
   resourceManager,
   imageProcessor
): DocxDocumentRenderer2;
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

`DocxDocumentRenderer2`

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`constructor`](Class.DocumentRendererBase#constructor)

## Properties

### \_imageProcessor

```ts
protected readonly _imageProcessor: IImageProcessor;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L25)

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`_imageProcessor`](Class.DocumentRendererBase#_imageprocessor)

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

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`_options`](Class.DocumentRendererBase#_options)

---

### \_resourceManager

```ts
protected readonly _resourceManager: ResourceManager;
```

Defined in: [libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/abstracts/DocumentRendererBase.ts#L23)

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`_resourceManager`](Class.DocumentRendererBase#_resourcemanager)

## Accessors

### supportedFormats

#### Get Signature

```ts
get supportedFormats(): readonly DocumentFormat[];
```

Defined in: [libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts#L25)

Supported document formats.

##### Returns

readonly [`DocumentFormat`](TypeAlias.DocumentFormat)[]

Supported document formats for this renderer.

#### Overrides

[`DocumentRendererBase`](Class.DocumentRendererBase).[`supportedFormats`](Class.DocumentRendererBase#supportedformats)

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

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`isImagePayload`](Class.DocumentRendererBase#isimagepayload)

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

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`preprocessData`](Class.DocumentRendererBase#preprocessdata)

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

#### Inherited from

[`DocumentRendererBase`](Class.DocumentRendererBase).[`processImages`](Class.DocumentRendererBase#processimages)

---

### render()

```ts
render(options): Promise<IRenderResult>;
```

Defined in: [libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/renderer/DocxDocumentRenderer2.ts#L37)

Render DOCX document from template.
Template processing is delegated to the parser (no template logic in renderer).

#### Parameters

| Parameter | Type                                         | Description    |
| --------- | -------------------------------------------- | -------------- |
| `options` | [`IRenderOptions`](Interface.IRenderOptions) | Render options |

#### Returns

`Promise`\<[`IRenderResult`](Interface.IRenderResult)\>

Render result

#### Overrides

[`DocumentRendererBase`](Class.DocumentRendererBase).[`render`](Class.DocumentRendererBase#render)
