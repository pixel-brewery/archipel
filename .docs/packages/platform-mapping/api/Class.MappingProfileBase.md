---
title: 'Abstract Class: MappingProfileBase'
generated: true
editUrl: false
---

# Abstract Class: MappingProfileBase

Defined in: [libs/platform-mapping/src/profile/abstracts/MappingProfileBase.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/profile/abstracts/MappingProfileBase.ts#L9)

Base class for mapping profiles to simplify implementation.

## Implements

- [`IMappingProfile`](Interface.IMappingProfile)

## Constructors

### Constructor

```ts
new MappingProfileBase(): MappingProfileBase;
```

#### Returns

`MappingProfileBase`

## Methods

### configure()

```ts
abstract configure(builder): void;
```

Defined in: [libs/platform-mapping/src/profile/abstracts/MappingProfileBase.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/profile/abstracts/MappingProfileBase.ts#L28)

Configures the mapping profile.

#### Parameters

| Parameter | Type                                           | Description          |
| --------- | ---------------------------------------------- | -------------------- |
| `builder` | [`IMappingBuilder`](Interface.IMappingBuilder) | The mapping builder. |

#### Returns

`void`

#### Implementation of

[`IMappingProfile`](Interface.IMappingProfile).[`configure`](Interface.IMappingProfile#configure)
