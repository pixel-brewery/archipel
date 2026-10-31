---
title: 'Interface: IMailTemplate'
generated: true
editUrl: false
---

# Interface: IMailTemplate

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L6)

Represents a single mail template record stored in a persistent store.

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L37)

Human-readable description of this template's purpose.

---

### htmlBody?

```ts
readonly htmlBody?: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L27)

HTML body of the template. Contains Handlebars-style placeholders.

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L10)

Unique template key used to identify this template (e.g. `AuthRegister`, `AppointmentInvitation`).

---

### locale?

```ts
readonly locale?: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L16)

Locale identifier (e.g. `de`, `en`). Used for multi-language support.
When `undefined`, it is the default/fallback template.

---

### placeholders?

```ts
readonly placeholders?: readonly string[];
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L42)

List of placeholder names expected by this template (for documentation/validation).

---

### subject

```ts
readonly subject: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L22)

Default subject line for this template.
Can contain placeholders (e.g. `{{appName}}`).

---

### txtBody?

```ts
readonly txtBody?: string;
```

Defined in: [libs/platform-mailing/src/models/IMailTemplate.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/models/IMailTemplate.ts#L32)

Plain-text body of the template. Contains Handlebars-style placeholders.
