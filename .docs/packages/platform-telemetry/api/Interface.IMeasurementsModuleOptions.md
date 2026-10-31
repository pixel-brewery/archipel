---
title: 'Interface: IMeasurementsModuleOptions'
generated: true
editUrl: false
---

# Interface: IMeasurementsModuleOptions

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L6)

Configuration for one direct numeric measurement sink.

## Properties

### diagnostics?

```ts
diagnostics?: IDiagnosticsOptions;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L16)

Enables sanitized operational failure reporting, including HTTP server errors.

---

### httpInterceptor?

```ts
httpInterceptor?: boolean;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L9)

---

### httpLifecycle?

```ts
httpLifecycle?: boolean | "manual";
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L11)

Express/Node response lifecycle measurement. Use manual to install the exported middleware before host middleware.

---

### imports?

```ts
imports?: (
  | DynamicModule
  | Type<any>
  | Promise<DynamicModule>
  | ForwardReference<any>)[];
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:14](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L14)

---

### isGlobal?

```ts
isGlobal?: boolean;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L8)

---

### providers?

```ts
providers?: Provider[];
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:13](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L13)

Optional sink dependencies, including provider-specific configuration tokens.

---

### sink

```ts
sink: Type<MeasurementSinkBase>;
```

Defined in: [libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts:7](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/MeasurementsModuleOptions.ts#L7)
