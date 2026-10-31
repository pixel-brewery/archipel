---
title: 'Class: ProviderInstrumentation'
generated: true
editUrl: false
---

# Class: ProviderInstrumentation

Defined in: [libs/platform-telemetry/src/otel/ProviderInstrumentation.ts:5](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/ProviderInstrumentation.ts#L5)

Adds provider method spans through Nest's public instance-decorator bootstrap hook.

## Constructors

### Constructor

```ts
new ProviderInstrumentation(options): ProviderInstrumentation;
```

Defined in: [libs/platform-telemetry/src/otel/ProviderInstrumentation.ts:28](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/ProviderInstrumentation.ts#L28)

#### Parameters

| Parameter                  | Type                                                                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`                  | \{ `classifyFailure?`: (`error`) => `Readonly`\<`Record`\<`string`, `string`\>\>; `include`: (`instance`) => `boolean`; `recordFailure?`: (`span`, `error`) => `void`; \} | Explicit provider selection and optional safe error classification. The classifier may return `error.type`, `failure.kind`, `error.code`, `cause.code` and `http.response.status_code`; only bounded machine-readable values are retained. The synchronous `recordFailure` hook may enrich failed spans with host-sanitized exception events; the host owns the enrichment's privacy and size limits. |
| `options.classifyFailure?` | (`error`) => `Readonly`\<`Record`\<`string`, `string`\>\>                                                                                                                 | -                                                                                                                                                                                                                                                                                                                                                                                                     |
| `options.include`          | (`instance`) => `boolean`                                                                                                                                                 | -                                                                                                                                                                                                                                                                                                                                                                                                     |
| `options.recordFailure?`   | (`span`, `error`) => `void`                                                                                                                                               | -                                                                                                                                                                                                                                                                                                                                                                                                     |

#### Returns

`ProviderInstrumentation`

## Methods

### instanceDecorator()

```ts
readonly instanceDecorator(instance): unknown;
```

Defined in: [libs/platform-telemetry/src/otel/ProviderInstrumentation.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-telemetry/src/otel/ProviderInstrumentation.ts#L9)

Pass this bound callback to Nest's `instrument.instanceDecorator` option.

#### Parameters

| Parameter  | Type      |
| ---------- | --------- |
| `instance` | `unknown` |

#### Returns

`unknown`
