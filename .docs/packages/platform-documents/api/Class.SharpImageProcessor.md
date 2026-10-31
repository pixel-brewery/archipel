---
title: 'Class: SharpImageProcessor'
generated: true
editUrl: false
---

# Class: SharpImageProcessor

Defined in: [libs/platform-documents/src/processor/SharpImageProcessor.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/SharpImageProcessor.ts#L21)

Sharp-based image processor.
Handles image resizing and format conversion.

## Implements

- [`IImageProcessor`](Interface.IImageProcessor)

## Constructors

### Constructor

```ts
new SharpImageProcessor(options): SharpImageProcessor;
```

Defined in: [libs/platform-documents/src/processor/SharpImageProcessor.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/SharpImageProcessor.ts#L31)

#### Parameters

| Parameter | Type                                                         |
| --------- | ------------------------------------------------------------ |
| `options` | [`IDocumentModuleOptions`](Interface.IDocumentModuleOptions) |

#### Returns

`SharpImageProcessor`

## Methods

### process()

```ts
process(payload): Promise<IImagePayload>;
```

Defined in: [libs/platform-documents/src/processor/SharpImageProcessor.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/SharpImageProcessor.ts#L46)

Process image payload.

#### Parameters

| Parameter | Type                                       | Description   |
| --------- | ------------------------------------------ | ------------- |
| `payload` | [`IImagePayload`](Interface.IImagePayload) | Image payload |

#### Returns

`Promise`\<[`IImagePayload`](Interface.IImagePayload)\>

Processed payload

#### Implementation of

[`IImageProcessor`](Interface.IImageProcessor).[`process`](Interface.IImageProcessor#process)

---

### toJpeg()

```ts
toJpeg(
   buffer,
   width?,
   height?,
   quality?
): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: [libs/platform-documents/src/processor/SharpImageProcessor.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/SharpImageProcessor.ts#L120)

Convert to JPEG.

#### Parameters

| Parameter  | Type     | Default value | Description   |
| ---------- | -------- | ------------- | ------------- |
| `buffer`   | `Buffer` | `undefined`   | Image buffer  |
| `width?`   | `number` | `undefined`   | Target width  |
| `height?`  | `number` | `undefined`   | Target height |
| `quality?` | `number` | `90`          | JPEG quality  |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

JPEG buffer

#### Implementation of

[`IImageProcessor`](Interface.IImageProcessor).[`toJpeg`](Interface.IImageProcessor#tojpeg)

---

### toPng()

```ts
toPng(
   buffer,
   width?,
   height?
): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: [libs/platform-documents/src/processor/SharpImageProcessor.ts:93](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/SharpImageProcessor.ts#L93)

Convert to PNG.

#### Parameters

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `buffer`  | `Buffer` | Image buffer  |
| `width?`  | `number` | Target width  |
| `height?` | `number` | Target height |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

PNG buffer

#### Implementation of

[`IImageProcessor`](Interface.IImageProcessor).[`toPng`](Interface.IImageProcessor#topng)
