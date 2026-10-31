---
title: 'Interface: IImagePayload'
generated: true
editUrl: false
---

# Interface: IImagePayload

Defined in: [libs/platform-documents/src/interfaces/IImagePayload.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IImagePayload.ts#L8)

Image payload for templates.

## Properties

### data

```ts
data: string | Buffer<ArrayBufferLike>;
```

Defined in: [libs/platform-documents/src/interfaces/IImagePayload.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IImagePayload.ts#L12)

Image data (Buffer or base64 string).

---

### height?

```ts
height?: number;
```

Defined in: [libs/platform-documents/src/interfaces/IImagePayload.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IImagePayload.ts#L22)

Desired height in pixels.

---

### mimeType?

```ts
mimeType?: ImageMimeType;
```

Defined in: [libs/platform-documents/src/interfaces/IImagePayload.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IImagePayload.ts#L27)

Image MIME type.

---

### width?

```ts
width?: number;
```

Defined in: [libs/platform-documents/src/interfaces/IImagePayload.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-documents/src/interfaces/IImagePayload.ts#L17)

Desired width in pixels.
