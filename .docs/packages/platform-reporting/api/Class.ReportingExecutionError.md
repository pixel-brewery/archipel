---
title: 'Class: ReportingExecutionError'
generated: true
editUrl: false
---

# Class: ReportingExecutionError

Defined in: [libs/platform-reporting/src/models/errors/ReportingExecutionError.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingExecutionError.ts#L6)

Error thrown when a reporting query execution fails unexpectedly.

## Extends

- `Error`

## Constructors

### Constructor

```ts
new ReportingExecutionError(datasetId, cause): ReportingExecutionError;
```

Defined in: [libs/platform-reporting/src/models/errors/ReportingExecutionError.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingExecutionError.ts#L16)

#### Parameters

| Parameter   | Type      |
| ----------- | --------- |
| `datasetId` | `string`  |
| `cause`     | `unknown` |

#### Returns

`ReportingExecutionError`

#### Overrides

`Error.constructor`

## Properties

### cause

```ts
readonly cause: unknown;
```

Defined in: [libs/platform-reporting/src/models/errors/ReportingExecutionError.ts:10](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingExecutionError.ts#L10)

#### Overrides

`Error.cause`

---

### datasetId

```ts
readonly datasetId: string;
```

Defined in: [libs/platform-reporting/src/models/errors/ReportingExecutionError.ts:9](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/errors/ReportingExecutionError.ts#L9)
