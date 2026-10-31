---
title: 'Class: MeasurementsModule'
generated: true
editUrl: false
---

# Class: MeasurementsModule

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModule.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModule.ts#L14)

Installs one direct measurement sink and optional HTTP instrumentation.

## Implements

- `NestModule`

## Constructors

### Constructor

```ts
new MeasurementsModule(options): MeasurementsModule;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModule.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModule.ts#L23)

#### Parameters

| Parameter | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `options` | [`IMeasurementsModuleOptions`](Interface.IMeasurementsModuleOptions) |

#### Returns

`MeasurementsModule`

## Methods

### configure()

```ts
configure(consumer): void;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModule.ts:58](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModule.ts#L58)

#### Parameters

| Parameter  | Type                 |
| ---------- | -------------------- |
| `consumer` | `MiddlewareConsumer` |

#### Returns

`void`

#### Implementation of

`NestModule.configure`

---

### register()

```ts
static register(options): DynamicModule;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModule.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModule.ts#L33)

#### Parameters

| Parameter | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `options` | [`IMeasurementsModuleOptions`](Interface.IMeasurementsModuleOptions) |

#### Returns

`DynamicModule`
