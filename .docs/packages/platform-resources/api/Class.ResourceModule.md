---
title: 'Class: ResourceModule'
generated: true
editUrl: false
---

# Class: ResourceModule

Defined in: [libs/platform-resources/src/ResourceModule.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceModule.ts#L15)

Module providing the ResourceManager.

## Constructors

### Constructor

```ts
new ResourceModule(): ResourceModule;
```

#### Returns

`ResourceModule`

## Methods

### forRoot()

```ts
static forRoot(config): DynamicModule;
```

Defined in: [libs/platform-resources/src/ResourceModule.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-resources/src/ResourceModule.ts#L25)

Registers the ResourceManager with the provided configuration.

#### Parameters

| Parameter | Type                                                         | Description                        |
| --------- | ------------------------------------------------------------ | ---------------------------------- |
| `config`  | [`IResourceManagerConfig`](Interface.IResourceManagerConfig) | The resource manager configuration |

#### Returns

`DynamicModule`

A dynamic module
