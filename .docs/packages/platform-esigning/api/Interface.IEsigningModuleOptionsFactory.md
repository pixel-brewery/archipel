---
title: 'Interface: IEsigningModuleOptionsFactory'
generated: true
editUrl: false
---

# Interface: IEsigningModuleOptionsFactory

Defined in: [libs/platform-esigning/src/EsigningModule.ts:79](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L79)

Factory interface for creating e-signing module options asynchronously.

## Methods

### createEsigningOptions()

```ts
createEsigningOptions():
  | IEsigningModuleOptions
| Promise<IEsigningModuleOptions>;
```

Defined in: [libs/platform-esigning/src/EsigningModule.ts:85](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-esigning/src/EsigningModule.ts#L85)

Creates the module options.

#### Returns

\| [`IEsigningModuleOptions`](Interface.IEsigningModuleOptions)
\| `Promise`\<[`IEsigningModuleOptions`](Interface.IEsigningModuleOptions)\>

The module configuration options or a promise resolving to them.
