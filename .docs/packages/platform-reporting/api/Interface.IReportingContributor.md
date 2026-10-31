---
title: 'Interface: IReportingContributor'
generated: true
editUrl: false
---

# Interface: IReportingContributor

Defined in: [libs/platform-reporting/src/core/ReportingContributor.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributor.ts#L12)

Describes a feature-level contributor that exposes reporting datasets.

## Properties

### featureKey

```ts
readonly featureKey: string;
```

Defined in: [libs/platform-reporting/src/core/ReportingContributor.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributor.ts#L16)

Feature namespace associated with the contributor.

## Methods

### executeQuery()

```ts
executeQuery(_dataset, _request): Promise<IReportingQueryResult>;
```

Defined in: [libs/platform-reporting/src/core/ReportingContributor.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributor.ts#L26)

Executes the dataset query defined by the given request.

#### Parameters

| Parameter  | Type                                               |
| ---------- | -------------------------------------------------- |
| `_dataset` | [`IReportingDataset`](Interface.IReportingDataset) |
| `_request` | [`IReportingQuery`](Interface.IReportingQuery)     |

#### Returns

`Promise`\<[`IReportingQueryResult`](Interface.IReportingQueryResult)\>

---

### listDatasets()

```ts
listDatasets(): Promise<readonly IReportingDataset[]>;
```

Defined in: [libs/platform-reporting/src/core/ReportingContributor.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributor.ts#L21)

Returns the datasets exposed by the contributor.

#### Returns

`Promise`\<readonly [`IReportingDataset`](Interface.IReportingDataset)[]\>
