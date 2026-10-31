---
title: 'Interface: IMailModuleOptions'
generated: true
editUrl: false
---

# Interface: IMailModuleOptions

Defined in: [libs/platform-mailing/src/MailModule.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L26)

Options for configuring the [MailModule](Class.MailModule).

## Properties

### configEntries?

```ts
readonly configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-mailing/src/MailModule.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L48)

Provider-specific configuration entries to register with the config module.

---

### deliveryStrategy

```ts
readonly deliveryStrategy: Type<DeliveryStrategyBase>;
```

Defined in: [libs/platform-mailing/src/MailModule.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L31)

Concrete implementation of the [DeliveryStrategyBase](Class.DeliveryStrategyBase) abstract base.
For example, `SmtpDeliveryStrategy`, `PostmarkDeliveryStrategy`, or `EmptyDeliveryStrategy`.

---

### isGlobal?

```ts
readonly isGlobal?: boolean;
```

Defined in: [libs/platform-mailing/src/MailModule.ts:43](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L43)

Whether to register the module globally.
Defaults to `true`.

---

### templateFetchStrategy

```ts
readonly templateFetchStrategy: Type<TemplateFetchStrategyBase>;
```

Defined in: [libs/platform-mailing/src/MailModule.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L37)

Concrete implementation of the [TemplateFetchStrategyBase](Class.TemplateFetchStrategyBase) abstract base.
For example, `FileTemplateFetchStrategy`, `BlobTemplateFetchStrategy`, or `DatabaseTemplateFetchStrategy`.

---

### templateNames?

```ts
readonly templateNames?: readonly string[];
```

Defined in: [libs/platform-mailing/src/MailModule.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L57)

Template names to load when using the `FileTemplateFetchStrategy`.
Each name corresponds to a resource file (e.g. `'AuthRegister'` loads
`AuthRegister.html` and `AuthRegister.txt`).

Defaults to an empty array (no templates loaded).

---

### templateRepositoryProvider?

```ts
readonly templateRepositoryProvider?: Provider<IMailTemplateRepository>;
```

Defined in: [libs/platform-mailing/src/MailModule.ts:75](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/MailModule.ts#L75)

Provider for the `IMailTemplateRepository` abstract base.
Required when using `DatabaseTemplateFetchStrategy`.

Example:

```typescript
MailModule.register({
    deliveryStrategy: SmtpDeliveryStrategy,
    templateFetchStrategy: DatabaseTemplateFetchStrategy,
    templateRepositoryProvider: {
        provide: MAIL_TEMPLATE_REPOSITORY_TOKEN,
        useClass: PrismaMailTemplateRepository,
    },
});
```
