---
title: 'Interface: IReportingDatasetField'
generated: true
editUrl: false
---

# Interface: IReportingDatasetField

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:25](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L25)

Describes a single field inside a reporting dataset.

## Properties

### description?

```ts
readonly description?: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:49](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L49)

Optional documentation describing the semantic meaning of the field.

---

### fieldId

```ts
readonly fieldId: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:29](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L29)

Unique identifier of the field within the dataset.

---

### isNullable

```ts
readonly isNullable: boolean;
```

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:44](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L44)

Indicates whether the field can contain null values.

---

### label

```ts
readonly label: string;
```

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:34](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L34)

Human readable name of the field.

---

### type

```ts
readonly type: ReportingFieldType;
```

Defined in: [libs/platform-reporting/src/models/ReportingDatasetField.ts:39](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/models/ReportingDatasetField.ts#L39)

Field type exposed to consumers.
