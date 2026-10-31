---
title: 'Class: ReportingFacade'
generated: true
editUrl: false
---

# Class: ReportingFacade

Defined in: [libs/platform-reporting/src/core/ReportingFacade.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingFacade.ts#L21)

Facade orchestrating dataset resolution and query execution for reporting consumers.

## Constructors

### Constructor

```ts
new ReportingFacade(registry): ReportingFacade;
```

Defined in: [libs/platform-reporting/src/core/ReportingFacade.ts:33](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingFacade.ts#L33)

#### Parameters

| Parameter  | Type                                                                 |
| ---------- | -------------------------------------------------------------------- |
| `registry` | [`ReportingContributorRegistry`](Class.ReportingContributorRegistry) |

#### Returns

`ReportingFacade`

## Methods

### executeQuery()

```ts
executeQuery(request): Promise<IReportingQueryResult>;
```

Defined in: [libs/platform-reporting/src/core/ReportingFacade.ts:54](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingFacade.ts#L54)

#### Parameters

| Parameter | Type                                           |
| --------- | ---------------------------------------------- |
| `request` | [`IReportingQuery`](Interface.IReportingQuery) |

#### Returns

`Promise`\<[`IReportingQueryResult`](Interface.IReportingQueryResult)\>

---

### getCatalog()

```ts
getCatalog(): Promise<readonly IReportingDataset[]>;
```

Defined in: [libs/platform-reporting/src/core/ReportingFacade.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingFacade.ts#L41)

#### Returns

`Promise`\<readonly [`IReportingDataset`](Interface.IReportingDataset)[]\>

---

### getDataset()

```ts
getDataset(datasetId): Promise<IReportingDataset>;
```

Defined in: [libs/platform-reporting/src/core/ReportingFacade.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingFacade.ts#L49)

#### Parameters

| Parameter   | Type     |
| ----------- | -------- |
| `datasetId` | `string` |

#### Returns

`Promise`\<[`IReportingDataset`](Interface.IReportingDataset)\>
