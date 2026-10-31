---
title: 'Class: OtelSdkHolder'
generated: true
editUrl: false
---

# Class: OtelSdkHolder

Defined in: [libs/platform-telemetry/src/OtelSdkHolder.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/OtelSdkHolder.ts#L16)

Holds a reference to the selected OpenTelemetry SDK components and
performs a graceful shutdown when the application terminates.

Replaces the former closure-based `otelSdkRef` pattern (TEL-1).

## Implements

- `OnApplicationShutdown`

## Constructors

### Constructor

```ts
new OtelSdkHolder(): OtelSdkHolder;
```

#### Returns

`OtelSdkHolder`

## Accessors

### isInitialized

#### Get Signature

```ts
get isInitialized(): boolean;
```

Defined in: [libs/platform-telemetry/src/OtelSdkHolder.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/OtelSdkHolder.ts#L32)

Whether the OpenTelemetry SDK has been initialized.

##### Returns

`boolean`

## Methods

### forceFlush()

```ts
forceFlush(timeoutMillis?): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/OtelSdkHolder.ts:57](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/OtelSdkHolder.ts#L57)

Flushes pending telemetry without stopping a warm application instance.
Hosts may retain this Promise through their serverless completion mechanism.
Optional telemetry failures are diagnosed and do not reject the host request.

#### Parameters

| Parameter        | Type     | Default value                   |
| ---------------- | -------- | ------------------------------- |
| `timeoutMillis?` | `number` | `defaultLifecycleTimeoutMillis` |

#### Returns

`Promise`\<`void`\>

---

### onApplicationShutdown()

```ts
onApplicationShutdown(): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/OtelSdkHolder.ts:69](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/OtelSdkHolder.ts#L69)

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

`OnApplicationShutdown.onApplicationShutdown`

---

### setSdk()

```ts
setSdk(sdk): void;
```

Defined in: [libs/platform-telemetry/src/OtelSdkHolder.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/OtelSdkHolder.ts#L44)

Stores the SDK reference so it can be shut down later.
Can only be called once - subsequent calls are ignored.

#### Parameters

| Parameter | Type                                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `sdk`     | `Pick`\<[`IOtelSdk`](Interface.IOtelSdk), `"shutdown"`\> & `Partial`\<`Pick`\<[`IOtelSdk`](Interface.IOtelSdk), `"forceFlush"`\>\> |

#### Returns

`void`
