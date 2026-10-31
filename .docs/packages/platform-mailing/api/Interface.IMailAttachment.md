---
title: 'Interface: IMailAttachment'
generated: true
editUrl: false
---

# Interface: IMailAttachment

Defined in: [libs/platform-mailing/src/models/IMailAttachment.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailAttachment.ts#L33)

Represents an email attachment.

## Properties

### content

```ts
readonly content: string | Buffer<ArrayBufferLike>;
```

Defined in: [libs/platform-mailing/src/models/IMailAttachment.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailAttachment.ts#L42)

The raw content of the attachment.

---

### contentType

```ts
readonly contentType: string;
```

Defined in: [libs/platform-mailing/src/models/IMailAttachment.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailAttachment.ts#L47)

The MIME type of the attachment.

---

### filename

```ts
readonly filename: string;
```

Defined in: [libs/platform-mailing/src/models/IMailAttachment.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailAttachment.ts#L37)

The filename of the attachment as displayed to the recipient.
