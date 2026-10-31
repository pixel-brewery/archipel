---
title: 'Interface: IEsigningModuleOptions'
generated: true
editUrl: false
---

# Interface: IEsigningModuleOptions

Defined in: [libs/platform-esigning/src/EsigningModule.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L18)

Configuration options for the [EsigningModule](Class.EsigningModule).

## Properties

### configEntries?

```ts
configEntries?: readonly Omit<IConfigRegistryEntry<unknown>, "module">[];
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L28)

Provider-specific configuration entries to register with the config module.

---

### isGlobal?

```ts
isGlobal?: boolean;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L39)

When `true` the module is registered globally.

---

### persistence?

```ts
persistence?: Type<EsigningPersistenceBase>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L34)

Concrete implementation of the [EsigningPersistenceBase](Class.EsigningPersistenceBase).
Required when the application needs to persist signing request state.

---

### provider

```ts
provider: Type<EsigningClientBase>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L23)

Concrete implementation of the [EsigningClientBase](Class.EsigningClientBase).
For example, `InternalEsigningProvider`, `DocuSignClient`, `AdobeSignClient`, etc.
