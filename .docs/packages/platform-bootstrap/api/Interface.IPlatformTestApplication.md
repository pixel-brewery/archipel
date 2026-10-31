---
title: 'Interface: IPlatformTestApplication'
generated: true
editUrl: false
---

# Interface: IPlatformTestApplication

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L9)

In-memory application contract used by platform bootstrap tests.

## Properties

### calls

```ts
readonly calls: readonly string[];
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L11)

Registered middleware and pipes/filters in execution order.

---

### configService

```ts
readonly configService: ConfigService;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L14)

Config service used by the test application.

## Methods

### enableCors()

```ts
enableCors(...args): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L17)

Enables CORS on the test application.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`void`

---

### get()

```ts
get<TResult>(token, ...args): TResult;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L20)

Resolves a provider from the test application.

#### Type Parameters

| Type Parameter                                | Default type |
| --------------------------------------------- | ------------ |
| <a id="type-parameter-tresult"></a> `TResult` | `unknown`    |

#### Parameters

| Parameter | Type                                        |
| --------- | ------------------------------------------- |
| `token`   | `string` \| `symbol` \| `Type`\<`unknown`\> |
| ...`args` | readonly `unknown`[]                        |

#### Returns

`TResult`

---

### init()

```ts
init(): Promise<void>;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L23)

Initializes the test application.

#### Returns

`Promise`\<`void`\>

---

### listen()

```ts
listen(...args): Promise<void>;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L26)

Starts the test application listener.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`Promise`\<`void`\>

---

### setGlobalPrefix()

```ts
setGlobalPrefix(prefix): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L29)

Sets the global test route prefix.

#### Parameters

| Parameter | Type     |
| --------- | -------- |
| `prefix`  | `string` |

#### Returns

`void`

---

### use()

```ts
use(...args): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L32)

Registers middleware on the test application.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`void`

---

### useGlobalFilters()

```ts
useGlobalFilters(...args): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L35)

Registers global filters on the test application.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`void`

---

### useGlobalInterceptors()

```ts
useGlobalInterceptors(...args): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:38](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L38)

Registers global interceptors on the test application.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`void`

---

### useGlobalPipes()

```ts
useGlobalPipes(...args): void;
```

Defined in: [libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/testing/IPlatformTestApplication.ts#L41)

Registers global pipes on the test application.

#### Parameters

| Parameter | Type                 |
| --------- | -------------------- |
| ...`args` | readonly `unknown`[] |

#### Returns

`void`
