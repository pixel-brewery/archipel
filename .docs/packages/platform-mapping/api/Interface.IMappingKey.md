---
title: 'Interface: IMappingKey\<TInput, TOutput\>'
generated: true
editUrl: false
---

# Interface: IMappingKey\<TInput, TOutput\>

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L9)

Type-safe mapping key that encodes both input and output types.
This ensures compile-time type safety when using the mapping service.

## Type Parameters

| Type Parameter                                | Description                      |
| --------------------------------------------- | -------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   | The input type for the mapping.  |
| <a id="type-parameter-toutput"></a> `TOutput` | The output type for the mapping. |

## Properties

### \_brand

```ts
readonly _brand: "MappingKey";
```

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L10)

---

### \_input

```ts
readonly _input: TInput;
```

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L11)

---

### \_output

```ts
readonly _output: TOutput;
```

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L12)

---

### key

```ts
readonly key: string;
```

Defined in: [libs/platform-mapping/src/types/MappingKey.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/types/MappingKey.ts#L13)
