---
title: 'Interface: IReportingDataset'
generated: true
editUrl: false
---

# Interface: IReportingDataset

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L12)

Represents a dataset definition that can be consumed through the reporting API.

## Properties

### datasetId

```ts
readonly datasetId: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:16](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L16)

Fully qualified dataset identifier (`<feature>.<dataset>`).

---

### datasetKey

```ts
readonly datasetKey: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:26](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L26)

Dataset key within the feature namespace.

---

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:36](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L36)

Optional dataset description presented to consumers.

---

### featureKey

```ts
readonly featureKey: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:21](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L21)

Feature namespace owning the dataset.

---

### fields

```ts
readonly fields: readonly IReportingDatasetField[];
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:41](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L41)

Fields exposed by the dataset.

---

### name

```ts
readonly name: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDataset.ts:31](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDataset.ts#L31)

Human readable dataset name.
