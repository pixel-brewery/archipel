---
title: 'Interface: IRenderOptions'
generated: true
editUrl: false
---

# Interface: IRenderOptions

Defined in: [libs/platform-documents/src/interfaces/IRenderOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IRenderOptions.ts#L8)

Options for rendering a document.

## Properties

### data

```ts
readonly data: Record<string, unknown>;
```

Defined in: [libs/platform-documents/src/interfaces/IRenderOptions.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IRenderOptions.ts#L33)

Data payload for template placeholders.

---

### template?

```ts
readonly template?: string | Buffer<ArrayBufferLike>;
```

Defined in: [libs/platform-documents/src/interfaces/IRenderOptions.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IRenderOptions.ts#L28)

Template buffer for direct template upload.
Either templateId or templateBuffer must be provided.

- Buffer: Binary document content (DOCX, PDF)
- string: Raw XML document content (for DOCX only)

---

### templateFormat?

```ts
readonly templateFormat?: TemplateFormat;
```

Defined in: [libs/platform-documents/src/interfaces/IRenderOptions.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IRenderOptions.ts#L19)

Template format type (encodian or mustache).
Defaults to 'encodian' if not specified.

---

### templateId?

```ts
readonly templateId?: string;
```

Defined in: [libs/platform-documents/src/interfaces/IRenderOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IRenderOptions.ts#L13)

Template identifier for registered templates.
Either templateId or templateBuffer must be provided.
