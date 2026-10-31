// #region Imports

// #endregion

/**
 * Enumerates supported filter operators for dataset queries.
 *
 * @public
 */
export const ReportingFilterOperators = {
    Equals: 'equals',
    GreaterThanOrEqual: 'gte',
    In: 'in',
    LessThanOrEqual: 'lte',
} as const;

export type ReportingFilterOperator = (typeof ReportingFilterOperators)[keyof typeof ReportingFilterOperators];

/**
 * Describes a single filter applied to a dataset query execution.
 *
 * @public
 */
export interface IReportingQueryFilter {
    readonly fieldId: string;
    readonly operator: ReportingFilterOperator;
    readonly value: unknown;
}

/**
 * Represents a sorting instruction for a dataset query.
 *
 * @public
 */
export interface IReportingQuerySort {
    readonly fieldId: string;
    readonly direction: 'asc' | 'desc';
}

/**
 * Represents an execution request for a dataset query.
 *
 * @public
 */
export interface IReportingQuery {
    readonly datasetId: string;
    readonly filters?: ReadonlyArray<IReportingQueryFilter>;
    readonly sorts?: ReadonlyArray<IReportingQuerySort>;
    readonly limit?: number;
    readonly offset?: number;
}

// #endregion
