---
title: 'Interface: IEsigningModuleAsyncOptions'
generated: true
editUrl: false
---

# Interface: IEsigningModuleAsyncOptions

Defined in: [libs/platform-esigning/src/EsigningModule.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L47)

Async configuration options for the [EsigningModule](Class.EsigningModule).

## Extends

- `Pick`\<`ModuleMetadata`, `"imports"`\>

## Properties

### inject?

```ts
inject?: (InjectionToken | OptionalFactoryDependency)[];
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:51](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L51)

Injection tokens to make available to the factory.

---

### isGlobal?

```ts
isGlobal?: boolean;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L71)

When `true` the module is registered globally.

---

### useClass?

```ts
useClass?: Type<IEsigningModuleOptionsFactory>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:66](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L66)

Class to instantiate as factory.

---

### useExisting?

```ts
useExisting?: Type<IEsigningModuleOptionsFactory>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:61](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L61)

Existing provider that implements [IEsigningModuleOptionsFactory](Interface.IEsigningModuleOptionsFactory).

---

### useFactory?

```ts
useFactory?: (...args) =>
  | IEsigningModuleOptions
| Promise<IEsigningModuleOptions>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L56)

Factory function that returns module options (or a promise).

#### Parameters

| Parameter | Type        |
| --------- | ----------- |
| ...`args` | `unknown`[] |

#### Returns

\| [`IEsigningModuleOptions`](Interface.IEsigningModuleOptions)
\| `Promise`\<[`IEsigningModuleOptions`](Interface.IEsigningModuleOptions)\>
