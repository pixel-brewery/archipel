---
title: 'Class: MappingModule'
generated: true
editUrl: false
---

# Class: MappingModule

Defined in: [libs/platform-mapping/src/MappingModule.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingModule.ts#L19)

Module that provides mapping services and allows registration of mapping profiles.

## Constructors

### Constructor

```ts
new MappingModule(): MappingModule;
```

#### Returns

`MappingModule`

## Methods

### withProfiles()

```ts
static withProfiles(profiles): DynamicModule;
```

Defined in: [libs/platform-mapping/src/MappingModule.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingModule.ts#L27)

Configures the module with the given mapping profiles.

#### Parameters

| Parameter  | Type                                                       | Description                                    |
| ---------- | ---------------------------------------------------------- | ---------------------------------------------- |
| `profiles` | `Type`\<[`IMappingProfile`](Interface.IMappingProfile)\>[] | An array of mapping profile types to register. |

#### Returns

`DynamicModule`

A dynamic module with the specified profiles registered.
