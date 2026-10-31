---
title: 'Interface: IOtelSdk'
generated: true
editUrl: false
---

# Interface: IOtelSdk

Defined in: [libs/platform-telemetry/src/interfaces/IOtelSdk.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/interfaces/IOtelSdk.ts#L2)

Lifecycle of the OpenTelemetry components selected by the host application.

## Methods

### forceFlush()

```ts
forceFlush(timeoutMillis?): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/interfaces/IOtelSdk.ts:8](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/interfaces/IOtelSdk.ts#L8)

Exports pending telemetry without terminating the SDK.
The wait is bounded to 5 seconds unless a positive timeout is supplied.
Export failure or expiry rejects; callers decide how to retain/report the work.

#### Parameters

| Parameter        | Type     |
| ---------------- | -------- |
| `timeoutMillis?` | `number` |

#### Returns

`Promise`\<`void`\>

---

### shutdown()

```ts
shutdown(timeoutMillis?): Promise<void>;
```

Defined in: [libs/platform-telemetry/src/interfaces/IOtelSdk.ts:11](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/interfaces/IOtelSdk.ts#L11)

Stops instrumentation and shuts down the SDK once, with a bounded wait.

#### Parameters

| Parameter        | Type     |
| ---------------- | -------- |
| `timeoutMillis?` | `number` |

#### Returns

`Promise`\<`void`\>
