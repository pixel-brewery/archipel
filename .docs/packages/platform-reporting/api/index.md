---
title: '@pixel-brewery/archipel-platform-reporting'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-reporting

## Classes

| Class                                                                | Description                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [ReportingContributorRegistry](Class.ReportingContributorRegistry)   | Registry responsible for tracking feature-provided reporting contributors.           |
| [ReportingDatasetNotFoundError](Class.ReportingDatasetNotFoundError) | Error thrown when a dataset definition could not be resolved.                        |
| [ReportingExecutionError](Class.ReportingExecutionError)             | Error thrown when a reporting query execution fails unexpectedly.                    |
| [ReportingFacade](Class.ReportingFacade)                             | Facade orchestrating dataset resolution and query execution for reporting consumers. |
| [ReportingModule](Class.ReportingModule)                             | Global module providing the reporting facade and contributor registry.               |
| [ReportingQueryValidationError](Class.ReportingQueryValidationError) | Error thrown when a reporting query contains invalid filter or sort fields.          |

## Interfaces

| Interface                                                  | Description                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [IReportingContributor](Interface.IReportingContributor)   | Describes a feature-level contributor that exposes reporting datasets.          |
| [IReportingDataset](Interface.IReportingDataset)           | Represents a dataset definition that can be consumed through the reporting API. |
| [IReportingDatasetField](Interface.IReportingDatasetField) | Describes a single field inside a reporting dataset.                            |
| [IReportingQuery](Interface.IReportingQuery)               | Represents an execution request for a dataset query.                            |
| [IReportingQueryFilter](Interface.IReportingQueryFilter)   | Describes a single filter applied to a dataset query execution.                 |
| [IReportingQueryResult](Interface.IReportingQueryResult)   | Represents the result of a dataset query execution.                             |
| [IReportingQuerySort](Interface.IReportingQuerySort)       | Represents a sorting instruction for a dataset query.                           |

## Type Aliases

| Type Alias                                                   | Description                                              |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| [ReportingFieldType](TypeAlias.ReportingFieldType)           | -                                                        |
| [ReportingFilterOperator](TypeAlias.ReportingFilterOperator) | -                                                        |
| [ReportingQueryResultRow](TypeAlias.ReportingQueryResultRow) | Represents a single row returned by a reporting dataset. |

## Variables

| Variable                                                      | Description                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------------- |
| [ReportingFieldTypes](Variable.ReportingFieldTypes)           | Enumerates the supported field data types for reporting datasets. |
| [ReportingFilterOperators](Variable.ReportingFilterOperators) | Enumerates supported filter operators for dataset queries.        |
