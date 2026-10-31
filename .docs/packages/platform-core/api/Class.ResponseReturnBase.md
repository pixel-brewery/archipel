---
title: 'Abstract Class: ResponseReturnBase\<T\>'
generated: true
editUrl: false
---

# Abstract Class: ResponseReturnBase\<T\>

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L10)

## Type Parameters

| Type Parameter                    |
| --------------------------------- |
| <a id="type-parameter-t"></a> `T` |

## Constructors

### Constructor

```ts
new ResponseReturnBase<T>(): ResponseReturnBase<T>;
```

#### Returns

`ResponseReturnBase`\<`T`\>

## Properties

### data?

```ts
data?: T;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L32)

---

### details?

```ts
details?: unknown;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L44)

---

### error?

```ts
error?: string;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L38)

---

### status

```ts
status: number;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L26)

---

### success

```ts
success: boolean;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:18](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L18)

---

### timestamp

```ts
timestamp: string;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:52](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L52)

## Methods

### accepted()

#### Call Signature

```ts
static accepted<TReturn, TIn>(type, data): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:101](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L101)

Creates an accepted response.

##### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-treturn"></a> `TReturn` |
| <a id="type-parameter-tin"></a> `TIn`         |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`                           | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`\>

#### Call Signature

```ts
static accepted<TReturn, TIn>(type, data): ResponseReturnBase<TReturn[]>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:103](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L103)

Creates an accepted response.

##### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-1"></a> `TReturn` |
| <a id="type-parameter-tin-1"></a> `TIn`         |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`[]                         | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`[]\>

---

### badRequest()

```ts
static badRequest<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:132](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L132)

Creates a bad request response.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-2"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value   | Description                  |
| ---------- | --------- | --------------- | ---------------------------- |
| `message?` | `string`  | `'Bad Request'` | Human-readable error message |
| `details?` | `unknown` | `undefined`     | Optional error details       |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

Bad request response

---

### conflict()

```ts
static conflict<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:180](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L180)

Creates a conflict response.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-3"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value | Description                  |
| ---------- | --------- | ------------- | ---------------------------- |
| `message?` | `string`  | `'Conflict'`  | Human-readable error message |
| `details?` | `unknown` | `undefined`   | Optional error details       |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

Conflict response

---

### created()

#### Call Signature

```ts
static created<TReturn, TIn>(type, data): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:86](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L86)

Creates a resource created response.

##### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-4"></a> `TReturn` |
| <a id="type-parameter-tin-2"></a> `TIn`         |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`                           | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`\>

#### Call Signature

```ts
static created<TReturn, TIn>(type, data): ResponseReturnBase<TReturn[]>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:88](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L88)

Creates a resource created response.

##### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-5"></a> `TReturn` |
| <a id="type-parameter-tin-3"></a> `TIn`         |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`[]                         | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`[]\>

---

### error()

```ts
static error<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:187](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L187)

Generic server error (500). Prefer attaching a safe `details` object (no stack traces in prod).

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-6"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value             |
| ---------- | --------- | ------------------------- |
| `message?` | `string`  | `'Internal Server Error'` |
| `details?` | `unknown` | `undefined`               |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

---

### forbidden()

```ts
static forbidden<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:156](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L156)

Creates a forbidden response.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-7"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value | Description                  |
| ---------- | --------- | ------------- | ---------------------------- |
| `message?` | `string`  | `'Forbidden'` | Human-readable error message |
| `details?` | `unknown` | `undefined`   | Optional error details       |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

Forbidden response

---

### fromError()

```ts
static fromError<TReturn>(err, defaultStatus?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:195](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L195)

Converts an arbitrary error into a ResponseReturnBase.

- If you pass a Nest `HttpException`, consider extracting status/message first.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-8"></a> `TReturn` |

#### Parameters

| Parameter        | Type         | Default value                      |
| ---------------- | ------------ | ---------------------------------- |
| `err`            | `unknown`    | `undefined`                        |
| `defaultStatus?` | `HttpStatus` | `HttpStatus.INTERNAL_SERVER_ERROR` |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

---

### noContent()

```ts
static noContent<TReturn>(): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:114](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L114)

No content variant (204). `data` is undefined by contract.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-treturn-9"></a> `TReturn` |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

---

### notFound()

```ts
static notFound<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:168](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L168)

Creates a not found response.

#### Type Parameters

| Type Parameter                                   |
| ------------------------------------------------ |
| <a id="type-parameter-treturn-10"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value | Description                  |
| ---------- | --------- | ------------- | ---------------------------- |
| `message?` | `string`  | `'Not Found'` | Human-readable error message |
| `details?` | `unknown` | `undefined`   | Optional error details       |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

Not found response

---

### ok()

#### Call Signature

```ts
static ok<TReturn, TIn>(type, data): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:71](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L71)

Creates a successful response.

##### Type Parameters

| Type Parameter                                   |
| ------------------------------------------------ |
| <a id="type-parameter-treturn-11"></a> `TReturn` |
| <a id="type-parameter-tin-4"></a> `TIn`          |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`                           | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`\>

#### Call Signature

```ts
static ok<TReturn, TIn>(type, data): ResponseReturnBase<TReturn[]>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:73](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L73)

Creates a successful response.

##### Type Parameters

| Type Parameter                                   |
| ------------------------------------------------ |
| <a id="type-parameter-treturn-12"></a> `TReturn` |
| <a id="type-parameter-tin-5"></a> `TIn`          |

##### Parameters

| Parameter | Type                            | Description                |
| --------- | ------------------------------- | -------------------------- |
| `type`    | `ClassConstructor`\<`TReturn`\> | Class type to transform to |
| `data`    | `TIn`[]                         | The response data          |

##### Returns

`ResponseReturnBase`\<`TReturn`[]\>

---

### unauthorized()

```ts
static unauthorized<TReturn>(message?, details?): ResponseReturnBase<TReturn>;
```

Defined in: [libs/platform-core/src/models/abstracts/ResponseReturnBase.ts:144](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/models/abstracts/ResponseReturnBase.ts#L144)

Creates an unauthorized response.

#### Type Parameters

| Type Parameter                                   |
| ------------------------------------------------ |
| <a id="type-parameter-treturn-13"></a> `TReturn` |

#### Parameters

| Parameter  | Type      | Default value    | Description                  |
| ---------- | --------- | ---------------- | ---------------------------- |
| `message?` | `string`  | `'Unauthorized'` | Human-readable error message |
| `details?` | `unknown` | `undefined`      | Optional error details       |

#### Returns

`ResponseReturnBase`\<`TReturn`\>

Unauthorized response
