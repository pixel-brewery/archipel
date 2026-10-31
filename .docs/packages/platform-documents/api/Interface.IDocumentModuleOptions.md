---
title: 'Interface: IDocumentModuleOptions'
generated: true
editUrl: false
---

# Interface: IDocumentModuleOptions

Defined in: [libs/platform-documents/src/DocumentModule.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L14)

Configuration options for the DocumentModule.

## Properties

### debug?

```ts
readonly debug?: boolean;
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L49)

Enable debug logging for document processing pipeline.
When enabled, detailed logs will be written for:

- Parser strategy selection
- Template variable replacements
- Data object transformations
- Renderer processing steps

---

### delimiters?

```ts
readonly delimiters?: {
  end?: string;
  start?: string;
};
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L28)

Delimiters for template placeholders.

#### end?

```ts
readonly end?: string;
```

Ending delimiter.

##### Default

```ts
']]';
```

#### start?

```ts
readonly start?: string;
```

Starting delimiter.

##### Default

```ts
'[[';
```

---

### imageProcessor

```ts
readonly imageProcessor: Type<IImageProcessor>;
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:55](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L55)

Image processor implementation class.
Import from `@pixel-brewery/archipel-platform-documents/sharp` for the default Sharp-based processor.

---

### maxImageHeight?

```ts
readonly maxImageHeight?: number;
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L23)

Maximum image height in pixels.

---

### maxImageWidth?

```ts
readonly maxImageWidth?: number;
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L18)

Maximum image width in pixels.

---

### renderers

```ts
readonly renderers: Type<IDocumentRenderer>[];
```

Defined in: [libs/platform-documents/src/DocumentModule.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/DocumentModule.ts#L61)

Document renderer implementation classes.
Import from `@pixel-brewery/archipel-platform-documents/docx` and `/pdf` for the built-in renderers.
