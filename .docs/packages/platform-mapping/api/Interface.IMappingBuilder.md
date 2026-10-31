---
title: 'Interface: IMappingBuilder'
generated: true
editUrl: false
---

# Interface: IMappingBuilder

Defined in: [libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts#L24)

Defines the interface for a mapping builder.

## Methods

### createKeyedMap()

```ts
createKeyedMap<TInput, TOutput>(key, fn): this;
```

Defined in: [libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts#L50)

Creates a keyed mapping between two types with full type safety.
The mapping key encodes both input and output types at compile time.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

#### Parameters

| Parameter | Type                                                                 | Description                                                |
| --------- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| `key`     | [`IMappingKey`](Interface.IMappingKey)\<`TInput`, `TOutput`\>        | The type-safe mapping key.                                 |
| `fn`      | (`source`) => `MappingCompatible`\<`TInput`, `TOutput`\> & `TOutput` | The mapping function that must return a valid destination. |

#### Returns

`this`

---

### createMap()

```ts
createMap<TSource, TDestination>(
   source,
   destination,
   fn
): this;
```

Defined in: [libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/builder/interfaces/IMappingBuilder.ts#L36)

Creates a mapping between two types.
Ensures compile-time type compatibility between source and destination.

#### Type Parameters

| Type Parameter                                          |
| ------------------------------------------------------- |
| <a id="type-parameter-tsource"></a> `TSource`           |
| <a id="type-parameter-tdestination"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                                            | Description                                                |
| ------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `source`      | [`Constructor`](TypeAlias.Constructor)\<`TSource`\>                             | The source type.                                           |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\>                        | The destination type.                                      |
| `fn`          | (`source`) => `MappingCompatible`\<`TSource`, `TDestination`\> & `TDestination` | The mapping function that must return a valid destination. |

#### Returns

`this`
