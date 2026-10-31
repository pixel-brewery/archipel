---
title: 'Interface: IMailEvents'
generated: true
editUrl: false
---

# Interface: IMailEvents

Defined in: [libs/platform-mailing/src/events/IMailEvents.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/events/IMailEvents.ts#L16)

Represents the contract of events emitted by the mail domain.

Publishers only need to specify `recipientEmail`, `templateName`, and `templateParams`.
The subject is resolved from the stored template (industry-standard behavior).
An explicit `subject` can be provided as an override.

## Extends

- `IEventMap`

## Indexable

```ts
[eventName: string]: unknown
```

## Properties

### sendMail

```ts
sendMail: {
  locale?: string;
  recipientEmail: string;
  senderEmail?: string;
  subject?: string;
  templateName: string;
  templateParams: Record<string, string | number | boolean | Date | undefined | null>;
};
```

Defined in: [libs/platform-mailing/src/events/IMailEvents.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/events/IMailEvents.ts#L17)

#### locale?

```ts
locale?: string;
```

Optional locale for template resolution (e.g. `'de'`, `'en'`).

#### recipientEmail

```ts
recipientEmail: string;
```

Recipient email address.

#### senderEmail?

```ts
senderEmail?: string;
```

Optional sender email override. When omitted, uses the configured default.

#### subject?

```ts
subject?: string;
```

Optional subject override. When omitted, resolved from the template.

#### templateName

```ts
templateName: string;
```

Template key to resolve (e.g. `'AuthRegister'`).

#### templateParams

```ts
templateParams: Record<string, string | number | boolean | Date | undefined | null>;
```

Placeholder values to interpolate into subject and body.
