---
title: 'Class: MappingBuilder'
generated: true
editUrl: false
---

# Class: MappingBuilder

Defined in: [libs/platform-mapping/src/builder/MappingBuilder.ts:15](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/MappingBuilder.ts#L15)

A mapping builder that uses the mapping service to register maps.

## Implements

- [`IMappingBuilder`](Interface.IMappingBuilder)

## Constructors

### Constructor

```ts
new MappingBuilder(service): MappingBuilder;
```

Defined in: [libs/platform-mapping/src/builder/MappingBuilder.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/MappingBuilder.ts#L29)

Constructs a new instance of the `MappingBuilder` class.

#### Parameters

| Parameter | Type                                     |
| --------- | ---------------------------------------- |
| `service` | [`MappingService`](Class.MappingService) |

#### Returns

`MappingBuilder`

## Methods

### createKeyedMap()

```ts
createKeyedMap<TInput, TOutput>(key, fn): this;
```

Defined in: [libs/platform-mapping/src/builder/MappingBuilder.ts:60](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/MappingBuilder.ts#L60)

Creates a keyed mapping between two types with full type safety.
The mapping key encodes both input and output types at compile time.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

#### Parameters

| Parameter | Type                                                          | Description                |
| --------- | ------------------------------------------------------------- | -------------------------- |
| `key`     | [`IMappingKey`](Interface.IMappingKey)\<`TInput`, `TOutput`\> | The type-safe mapping key. |
| `fn`      | (`source`) => `TOutput`                                       | The mapping function.      |

#### Returns

`this`

#### Implementation of

[`IMappingBuilder`](Interface.IMappingBuilder).[`createKeyedMap`](Interface.IMappingBuilder#createkeyedmap)

---

### createMap()

```ts
createMap<TSource, TDestination>(
   source,
   destination,
   fn
): this;
```

Defined in: [libs/platform-mapping/src/builder/MappingBuilder.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/MappingBuilder.ts#L46)

Creates a mapping between two types.
Enforces compile-time type compatibility check.

#### Type Parameters

| Type Parameter                                          |
| ------------------------------------------------------- |
| <a id="type-parameter-tsource"></a> `TSource`           |
| <a id="type-parameter-tdestination"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                     | Description           |
| ------------- | -------------------------------------------------------- | --------------------- |
| `source`      | [`Constructor`](TypeAlias.Constructor)\<`TSource`\>      | The source type.      |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\> | The destination type. |
| `fn`          | (`source`) => `TDestination`                             | The mapping function. |

#### Returns

`this`

#### Implementation of

[`IMappingBuilder`](Interface.IMappingBuilder).[`createMap`](Interface.IMappingBuilder#createmap)
