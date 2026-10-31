---
title: 'Class: PlatformBootstrapContext\<TApplication\>'
generated: true
editUrl: false
---

# Class: PlatformBootstrapContext\<TApplication\>

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L9)

Runtime context shared by platform bootstrap steps.

## Type Parameters

| Type Parameter                                                                       | Default type       |
| ------------------------------------------------------------------------------------ | ------------------ |
| <a id="type-parameter-tapplication"></a> `TApplication` _extends_ `INestApplication` | `INestApplication` |

## Constructors

### Constructor

```ts
new PlatformBootstrapContext<TApplication>(app, configService?): PlatformBootstrapContext<TApplication>;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L19)

#### Parameters

| Parameter        | Type            |
| ---------------- | --------------- |
| `app`            | `TApplication`  |
| `configService?` | `ConfigService` |

#### Returns

`PlatformBootstrapContext`\<`TApplication`\>

## Accessors

### app

#### Get Signature

```ts
get app(): TApplication;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L33)

The wrapped NestJS application.

##### Returns

`TApplication`

---

### config

#### Get Signature

```ts
get config(): ConfigService;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:42](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L42)

The Archipel configuration service resolved from the app or builder options.

##### Returns

`ConfigService`

## Methods

### getConfigValue()

```ts
getConfigValue<TValue>(key): TValue;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:68](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L68)

Reads a required value from the configuration service.

#### Type Parameters

| Type Parameter                              |
| ------------------------------------------- |
| <a id="type-parameter-tvalue"></a> `TValue` |

#### Parameters

| Parameter | Type                     | Description                  |
| --------- | ------------------------ | ---------------------------- |
| `key`     | `IConfigKey`\<`TValue`\> | The typed configuration key. |

#### Returns

`TValue`

The typed configuration value.

---

### getService()

```ts
getService<TService>(token): TService;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L57)

Resolves a provider from the NestJS application container.

#### Type Parameters

| Type Parameter                                  |
| ----------------------------------------------- |
| <a id="type-parameter-tservice"></a> `TService` |

#### Parameters

| Parameter | Type                                         | Description         |
| --------- | -------------------------------------------- | ------------------- |
| `token`   | `string` \| `symbol` \| `Type`\<`TService`\> | The provider token. |

#### Returns

`TService`

The resolved provider instance.

---

### tryGetConfigValue()

```ts
tryGetConfigValue<TValue>(key, fallback): TValue;
```

Defined in: [libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts:80](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-bootstrap/src/context/PlatformBootstrapContext.ts#L80)

Reads an optional value from the configuration service.

#### Type Parameters

| Type Parameter                                |
| --------------------------------------------- |
| <a id="type-parameter-tvalue-1"></a> `TValue` |

#### Parameters

| Parameter  | Type                     | Description                                |
| ---------- | ------------------------ | ------------------------------------------ |
| `key`      | `IConfigKey`\<`TValue`\> | The typed configuration key.               |
| `fallback` | `TValue`                 | The fallback value when the key is absent. |

#### Returns

`TValue`

The typed configuration value or fallback.
