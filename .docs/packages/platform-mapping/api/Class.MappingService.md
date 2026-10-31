---
title: 'Class: MappingService'
generated: true
editUrl: false
---

# Class: MappingService

Defined in: [libs/platform-mapping/src/MappingService.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L19)

Central mapping registry supporting keyed & type-based mappings.

## Constructors

### Constructor

```ts
new MappingService(): MappingService;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L36)

Constructs a new instance of the `MappingService` class.

#### Returns

`MappingService`

## Methods

### map()

```ts
map<TInput, TOutput>(key, source): TOutput;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:99](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L99)

Maps a source object to a destination type using a type-safe mapping key.
The key encodes both input and output types, ensuring compile-time type safety.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

#### Parameters

| Parameter | Type                                                          | Description                |
| --------- | ------------------------------------------------------------- | -------------------------- |
| `key`     | [`IMappingKey`](Interface.IMappingKey)\<`TInput`, `TOutput`\> | The type-safe mapping key. |
| `source`  | `TInput`                                                      | The source object to map.  |

#### Returns

`TOutput`

The mapped destination object.

#### Example

```typescript
const response = this._mappingService.map(PRODUCT_MAPPING_KEY, productInput);
// response is automatically typed as ProductResponse
```

---

### mapTypes()

```ts
mapTypes<TSource, TDestination>(source, destination): TDestination;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:129](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L129)

Maps a source object to a destination type using a registered mapping function.

#### Type Parameters

| Type Parameter                                          |
| ------------------------------------------------------- |
| <a id="type-parameter-tsource"></a> `TSource`           |
| <a id="type-parameter-tdestination"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                     | Description                              |
| ------------- | -------------------------------------------------------- | ---------------------------------------- |
| `source`      | `TSource`                                                | The source object to map.                |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\> | The constructor of the destination type. |

#### Returns

`TDestination`

The mapped destination object.

---

### mapTypesArray()

```ts
mapTypesArray<TSource, TDestination>(sources, destination): TDestination[];
```

Defined in: [libs/platform-mapping/src/MappingService.ts:158](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L158)

Maps an array of source objects to an array of destination types using a registered mapping function.

#### Type Parameters

| Type Parameter                                            |
| --------------------------------------------------------- |
| <a id="type-parameter-tsource-1"></a> `TSource`           |
| <a id="type-parameter-tdestination-1"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                     | Description                              |
| ------------- | -------------------------------------------------------- | ---------------------------------------- |
| `sources`     | `TSource`[]                                              | The array of source objects to map.      |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\> | The constructor of the destination type. |

#### Returns

`TDestination`[]

The array of mapped destination objects.

---

### register()

```ts
register<TSource, TDestination>(key, fn): void;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L54)

Registers a mapping function for a specific key.

#### Type Parameters

| Type Parameter                                            |
| --------------------------------------------------------- |
| <a id="type-parameter-tsource-2"></a> `TSource`           |
| <a id="type-parameter-tdestination-2"></a> `TDestination` |

#### Parameters

| Parameter | Type                         | Description                     |
| --------- | ---------------------------- | ------------------------------- |
| `key`     | `string`                     | The unique key for the mapping. |
| `fn`      | (`source`) => `TDestination` | The mapping function.           |

#### Returns

`void`

void

---

### registerMap()

```ts
registerMap<TSource, TDestination>(
   source,
   destination,
   fn
): void;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L71)

Registers a mapping function for a specific source and destination type.

#### Type Parameters

| Type Parameter                                            |
| --------------------------------------------------------- |
| <a id="type-parameter-tsource-3"></a> `TSource`           |
| <a id="type-parameter-tdestination-3"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                     | Description                              |
| ------------- | -------------------------------------------------------- | ---------------------------------------- |
| `source`      | [`Constructor`](TypeAlias.Constructor)\<`TSource`\>      | The constructor of the source type.      |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\> | The constructor of the destination type. |
| `fn`          | (`source`) => `TDestination`                             | The mapping function.                    |

#### Returns

`void`

void

---

### registerProfile()

```ts
registerProfile(profile): void;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L169)

Registers a mapping profile containing multiple mappings.

#### Parameters

| Parameter | Type                                           | Description                      |
| --------- | ---------------------------------------------- | -------------------------------- |
| `profile` | [`IMappingProfile`](Interface.IMappingProfile) | The mapping profile to register. |

#### Returns

`void`

void

---

### tryMap()

```ts
tryMap<TInput, TOutput>(key, source): TOutput | undefined;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:115](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L115)

Attempts to map returning undefined instead of throwing when mapping is absent.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tinput-1"></a> `TInput`   |
| <a id="type-parameter-toutput-1"></a> `TOutput` |

#### Parameters

| Parameter | Type                                                          | Description                |
| --------- | ------------------------------------------------------------- | -------------------------- |
| `key`     | [`IMappingKey`](Interface.IMappingKey)\<`TInput`, `TOutput`\> | The type-safe mapping key. |
| `source`  | `TInput`                                                      | The source object to map.  |

#### Returns

`TOutput` \| `undefined`

The mapped destination object or undefined if no mapping exists.

---

### tryMapTypes()

```ts
tryMapTypes<TSource, TDestination>(source, destination): TDestination | undefined;
```

Defined in: [libs/platform-mapping/src/MappingService.ts:142](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/MappingService.ts#L142)

Safe variant of [mapTypes](#maptypes) that returns undefined if not registered.

#### Type Parameters

| Type Parameter                                            |
| --------------------------------------------------------- |
| <a id="type-parameter-tsource-4"></a> `TSource`           |
| <a id="type-parameter-tdestination-4"></a> `TDestination` |

#### Parameters

| Parameter     | Type                                                     |
| ------------- | -------------------------------------------------------- |
| `source`      | `TSource`                                                |
| `destination` | [`Constructor`](TypeAlias.Constructor)\<`TDestination`\> |

#### Returns

`TDestination` \| `undefined`
