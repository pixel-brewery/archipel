---
title: 'Interface: IDiagnosticsOptions'
generated: true
editUrl: false
---

# Interface: IDiagnosticsOptions

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts:2](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts#L2)

Host-owned classification and request correlation for operational diagnostics.

## Properties

### classifyFailure?

```ts
readonly classifyFailure?: (error) => Readonly<Record<string, string>>;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts:4](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts#L4)

Returns bounded, safe attributes; never return messages, SQL, credentials or customer data.

#### Parameters

| Parameter | Type      |
| --------- | --------- |
| `error`   | `unknown` |

#### Returns

`Readonly`\<`Record`\<`string`, `string`\>\>

---

### getCorrelationId?

```ts
readonly getCorrelationId?: () => string | undefined;
```

Defined in: [libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/measurements/DiagnosticsOptions.ts#L6)

Returns a host-generated correlation ID. IDs are exported to logs only.

#### Returns

`string` \| `undefined`
