---
title: 'Interface: IMailTemplateRepository'
generated: true
editUrl: false
---

# Interface: IMailTemplateRepository

Defined in: [libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts#L11)

Contract for mail template persistence.

Applications must implement this interface and register the implementation
via the `MAIL_TEMPLATE_REPOSITORY_TOKEN` when using the `database` template strategy.

## Methods

### delete()

```ts
delete(key, locale?): Promise<void>;
```

Defined in: [libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts#L42)

Deletes a template by key and locale.

#### Parameters

| Parameter | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| `key`     | `string` | The template key.                                            |
| `locale?` | `string` | Optional locale. When omitted, deletes the default template. |

#### Returns

`Promise`\<`void`\>

---

### findAll()

```ts
findAll(): Promise<IMailTemplate[]>;
```

Defined in: [libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts#L25)

Returns all templates available in the store.

#### Returns

`Promise`\<[`IMailTemplate`](Interface.IMailTemplate)[]\>

---

### findByKey()

```ts
findByKey(key, locale?): Promise<IMailTemplate | undefined>;
```

Defined in: [libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts#L20)

Finds a template by its unique key and optional locale.
When no locale is provided, returns the default (locale-agnostic) template.

#### Parameters

| Parameter | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| `key`     | `string` | The template key (e.g. `AuthRegister`).       |
| `locale?` | `string` | Optional locale identifier (e.g. `de`, `en`). |

#### Returns

`Promise`\<[`IMailTemplate`](Interface.IMailTemplate) \| `undefined`\>

The matching template, or `undefined` if not found.

---

### upsert()

```ts
upsert(template): Promise<IMailTemplate>;
```

Defined in: [libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mailing/src/interfaces/IMailTemplateRepository.ts#L34)

Creates or updates a template. Upsert semantics: if a template with the
same `key` and `locale` exists, it is overwritten.

#### Parameters

| Parameter  | Type                                       | Description              |
| ---------- | ------------------------------------------ | ------------------------ |
| `template` | [`IMailTemplate`](Interface.IMailTemplate) | The template to persist. |

#### Returns

`Promise`\<[`IMailTemplate`](Interface.IMailTemplate)\>

The persisted template.
