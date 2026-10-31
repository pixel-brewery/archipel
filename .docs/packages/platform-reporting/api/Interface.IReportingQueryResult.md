---
title: 'Interface: IReportingQueryResult'
generated: true
editUrl: false
---

# Interface: IReportingQueryResult

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:19](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L19)

Represents the result of a dataset query execution.

## Properties

### datasetId

```ts
readonly datasetId: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:20](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L20)

---

### fields

```ts
readonly fields: readonly IReportingDatasetField[];
```

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L21)

---

### generatedAt

```ts
readonly generatedAt: Date;
```

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:24](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L24)

---

### rows

```ts
readonly rows: readonly ReportingQueryResultRow[];
```

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L22)

---

### totalCount

```ts
readonly totalCount: number;
```

Defined in: [libs/platform-reporting/src/models/ReportingQueryResult.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQueryResult.ts#L23)
