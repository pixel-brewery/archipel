---
title: 'Class: ResponseReturn2\<T\>'
generated: true
editUrl: false
---

# Class: ResponseReturn2\<T\>

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L29)

Schema-native success response envelope for NestJS 12 applications.

Unlike [ResponseReturnBase](Class.ResponseReturnBase), this version validates and transforms response
data with a Standard Schema instead of a class constructor. Use
[ResponseReturn2.schema](#schema) as the schema for Nest response
serialization. OpenAPI must publish the complete envelope schema; its
`x-archipel-envelope` metadata allows compatible generators to recognize and
unwrap `data` explicitly.

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Properties

### data

```ts
readonly data: T;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:56](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L56)

Schema-validated response payload.

---

### status

```ts
readonly status: number;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:53](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L53)

HTTP status code of the response.

---

### success

```ts
readonly success: true;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L50)

Indicates that the request was successful.

---

### timestamp

```ts
readonly timestamp: string;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:59](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L59)

Server-side timestamp in ISO 8601 format.

## Methods

### accepted()

```ts
static accepted<TInput, TOutput>(
   dataSchema,
   data,
   validateOptions?
): Promise<ResponseReturn2<TOutput>>;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:105](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L105)

Creates an accepted response after validating and transforming its data.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tinput"></a> `TInput`   |
| <a id="type-parameter-toutput"></a> `TOutput` |

#### Parameters

| Parameter          | Type                                      | Description                                          |
| ------------------ | ----------------------------------------- | ---------------------------------------------------- |
| `dataSchema`       | `StandardSchemaV1`\<`TInput`, `TOutput`\> | Standard Schema used to serialize the response data. |
| `data`             | `TInput`                                  | Response data accepted by the schema.                |
| `validateOptions?` | `Options`                                 | Optional vendor-specific Standard Schema options.    |

#### Returns

`Promise`\<`ResponseReturn2`\<`TOutput`\>\>

#### Remarks

The controller must declare `@HttpCode(HttpStatus.ACCEPTED)`.

---

### created()

```ts
static created<TInput, TOutput>(
   dataSchema,
   data,
   validateOptions?
): Promise<ResponseReturn2<TOutput>>;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:89](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L89)

Creates a resource-created response after validating and transforming its data.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tinput-1"></a> `TInput`   |
| <a id="type-parameter-toutput-1"></a> `TOutput` |

#### Parameters

| Parameter          | Type                                      | Description                                          |
| ------------------ | ----------------------------------------- | ---------------------------------------------------- |
| `dataSchema`       | `StandardSchemaV1`\<`TInput`, `TOutput`\> | Standard Schema used to serialize the response data. |
| `data`             | `TInput`                                  | Response data accepted by the schema.                |
| `validateOptions?` | `Options`                                 | Optional vendor-specific Standard Schema options.    |

#### Returns

`Promise`\<`ResponseReturn2`\<`TOutput`\>\>

#### Remarks

The controller's HTTP status metadata must also resolve to 201.

---

### noContent()

```ts
static noContent(): undefined;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:120](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L120)

Returns the bodyless value for a 204 controller response.

Controllers must also use `@HttpCode(HttpStatus.NO_CONTENT)`. Do not
attach a response serializer schema to a 204 response because it has no
representation body.

#### Returns

`undefined`

---

### ok()

```ts
static ok<TInput, TOutput>(
   dataSchema,
   data,
   validateOptions?
): Promise<ResponseReturn2<TOutput>>;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L73)

Creates a successful response after validating and transforming its data.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tinput-2"></a> `TInput`   |
| <a id="type-parameter-toutput-2"></a> `TOutput` |

#### Parameters

| Parameter          | Type                                      | Description                                          |
| ------------------ | ----------------------------------------- | ---------------------------------------------------- |
| `dataSchema`       | `StandardSchemaV1`\<`TInput`, `TOutput`\> | Standard Schema used to serialize the response data. |
| `data`             | `TInput`                                  | Response data accepted by the schema.                |
| `validateOptions?` | `Options`                                 | Optional vendor-specific Standard Schema options.    |

#### Returns

`Promise`\<`ResponseReturn2`\<`TOutput`\>\>

#### Remarks

The controller's HTTP status metadata must also resolve to 200.

---

### schema()

```ts
static schema<TInput, TOutput>(dataSchema, id?): ResponseSchema2<TInput, TOutput>;
```

Defined in: [libs/platform-core/src/models/ResponseReturn2.ts:136](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/ResponseReturn2.ts#L136)

Creates the full response-envelope Standard Schema for runtime
serialization and OpenAPI output.

The data schema must implement both Standard Schema and Standard JSON
Schema. Zod 4 schemas satisfy both contracts. A named data schema produces
a named `ResponseReturn2...` OpenAPI component automatically. Publish
this complete schema to OpenAPI because it describes the actual wire body.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tinput-3"></a> `TInput`   |
| <a id="type-parameter-toutput-3"></a> `TOutput` |

#### Parameters

| Parameter    | Type                                 | Description                                                      |
| ------------ | ------------------------------------ | ---------------------------------------------------------------- |
| `dataSchema` | `DataSchema2`\<`TInput`, `TOutput`\> | Schema for the envelope's `data` property.                       |
| `id?`        | `string`                             | Optional explicit OpenAPI component identifier for the envelope. |

#### Returns

`ResponseSchema2`\<`TInput`, `TOutput`\>
