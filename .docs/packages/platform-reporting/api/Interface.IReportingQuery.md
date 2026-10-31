---
title: 'Interface: IReportingQuery'
generated: true
editUrl: false
---

# Interface: IReportingQuery

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:45](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L45)

Represents an execution request for a dataset query.

## Properties

### datasetId

```ts
readonly datasetId: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:46](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L46)

---

### filters?

```ts
readonly filters?: readonly IReportingQueryFilter[];
```

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:47](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L47)

---

### limit?

```ts
readonly limit?: number;
```

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L49)

---

### offset?

```ts
readonly offset?: number;
```

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:50](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L50)

---

### sorts?

```ts
readonly sorts?: readonly IReportingQuerySort[];
```

Defined in: [libs/platform-reporting/src/models/ReportingQuery.ts:48](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingQuery.ts#L48)
