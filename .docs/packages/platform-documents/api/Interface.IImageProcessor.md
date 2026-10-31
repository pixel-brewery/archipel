---
title: 'Interface: IImageProcessor'
generated: true
editUrl: false
---

# Interface: IImageProcessor

Defined in: [libs/platform-documents/src/processor/interfaces/IImageProcessor.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/interfaces/IImageProcessor.ts#L9)

Base interface for image processors.
Handles image manipulation and format conversion.

## Methods

### process()

```ts
process(payload): Promise<IImagePayload>;
```

Defined in: [libs/platform-documents/src/processor/interfaces/IImageProcessor.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/interfaces/IImageProcessor.ts#L16)

Process image payload (resize, format conversion).

#### Parameters

| Parameter | Type                                       | Description   |
| --------- | ------------------------------------------ | ------------- |
| `payload` | [`IImagePayload`](Interface.IImagePayload) | Image payload |

#### Returns

`Promise`\<[`IImagePayload`](Interface.IImagePayload)\>

Processed image payload

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

Defined in: [libs/platform-documents/src/processor/interfaces/IImageProcessor.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/interfaces/IImageProcessor.ts#L37)

Convert image to JPEG format.

#### Parameters

| Parameter  | Type     | Description          |
| ---------- | -------- | -------------------- |
| `buffer`   | `Buffer` | Image buffer         |
| `width?`   | `number` | Target width         |
| `height?`  | `number` | Target height        |
| `quality?` | `number` | JPEG quality (0-100) |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

JPEG buffer

---

### toPng()

```ts
toPng(
   buffer,
   width?,
   height?
): Promise<Buffer<ArrayBufferLike>>;
```

Defined in: [libs/platform-documents/src/processor/interfaces/IImageProcessor.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/processor/interfaces/IImageProcessor.ts#L26)

Convert image to PNG format.

#### Parameters

| Parameter | Type     | Description   |
| --------- | -------- | ------------- |
| `buffer`  | `Buffer` | Image buffer  |
| `width?`  | `number` | Target width  |
| `height?` | `number` | Target height |

#### Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

PNG buffer
