---
title: 'Class: ReportingContributorRegistry'
generated: true
editUrl: false
---

# Class: ReportingContributorRegistry

Defined in: [libs/platform-reporting/src/core/ReportingContributorRegistry.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributorRegistry.ts#L12)

Registry responsible for tracking feature-provided reporting contributors.

## Constructors

### Constructor

```ts
new ReportingContributorRegistry(): ReportingContributorRegistry;
```

#### Returns

`ReportingContributorRegistry`

## Methods

### getContributors()

```ts
getContributors(): readonly IReportingContributor[];
```

Defined in: [libs/platform-reporting/src/core/ReportingContributorRegistry.ts:35](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributorRegistry.ts#L35)

#### Returns

readonly [`IReportingContributor`](Interface.IReportingContributor)[]

---

### register()

```ts
register(contributor): void;
```

Defined in: [libs/platform-reporting/src/core/ReportingContributorRegistry.ts:23](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-reporting/src/core/ReportingContributorRegistry.ts#L23)

#### Parameters

| Parameter     | Type                                                       |
| ------------- | ---------------------------------------------------------- |
| `contributor` | [`IReportingContributor`](Interface.IReportingContributor) |

#### Returns

`void`
