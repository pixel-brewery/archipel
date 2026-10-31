---
title: 'Class: HostService'
generated: true
editUrl: false
---

# Class: HostService

Defined in: [libs/platform-core/src/services/HostService.ts:137](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L137)

The `HostService` class.

## Constructors

### Constructor

```ts
new HostService(
   configService,
   contentTemplateEngine,
   resourceManager
): HostService;
```

Defined in: [libs/platform-core/src/services/HostService.ts:153](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L153)

Constructs a new instance of the `HostService` class.

#### Parameters

| Parameter               | Type                                                   |
| ----------------------- | ------------------------------------------------------ |
| `configService`         | `ConfigService`                                        |
| `contentTemplateEngine` | [`ContentTemplateEngine`](Class.ContentTemplateEngine) |
| `resourceManager`       | `ResourceManager`                                      |

#### Returns

`HostService`

## Accessors

### host

#### Get Signature

```ts
get host(): string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:189](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L189)

The full host (URL + port in development).

##### Returns

`string`

---

### port

#### Get Signature

```ts
get port(): number;
```

Defined in: [libs/platform-core/src/services/HostService.ts:179](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L179)

The port of the host.

##### Returns

`number`

---

### stage

#### Get Signature

```ts
get stage(): "unknown" | "local" | "development" | "preview" | "production";
```

Defined in: [libs/platform-core/src/services/HostService.ts:199](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L199)

The current stage of the application.

##### Returns

`"unknown"` \| `"local"` \| `"development"` \| `"preview"` \| `"production"`

---

### url

#### Get Signature

```ts
get url(): string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:169](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L169)

The URL of the host.

##### Returns

`string`

---

### version

#### Get Signature

```ts
get version(): string;
```

Defined in: [libs/platform-core/src/services/HostService.ts:220](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L220)

The application version.

##### Returns

`string`

## Methods

### getHostContent()

```ts
getHostContent(params): Promise<string>;
```

Defined in: [libs/platform-core/src/services/HostService.ts:232](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-core/src/services/HostService.ts#L232)

Retrieves the host content

#### Parameters

| Parameter | Type                                                 |
| --------- | ---------------------------------------------------- |
| `params`  | [`IHostContentParams`](Interface.IHostContentParams) |

#### Returns

`Promise`\<`string`\>
